package com.revivio.repair;

import com.revivio.exception.InvalidWorkflowTransitionException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RepairWorkflowServiceTest {

    @Mock
    private RepairHistoryRepository repairHistoryRepository;

    @InjectMocks
    private RepairWorkflowService workflowService;

    private RepairRequest repairRequest;

    @BeforeEach
    void setUp() {
        repairRequest = RepairRequest.builder()
                .id(100L)
                .referenceNumber("RV-2026-00001")
                .status(RepairStatus.REQUESTED)
                .build();
    }

    @ParameterizedTest
    @CsvSource({
            "REQUESTED, UNDER_REVIEW",
            "UNDER_REVIEW, APPROVED",
            "UNDER_REVIEW, REJECTED",
            "APPROVED, ASSIGNED",
            "ASSIGNED, IN_REPAIR",
            "IN_REPAIR, COMPLETED"
    })
    @DisplayName("Should successfully validate all legal lifecycle state transitions")
    void testLegalStateTransitions(RepairStatus from, RepairStatus to) {
        repairRequest.setStatus(from);
        when(repairHistoryRepository.save(any(RepairHistory.class))).thenAnswer(i -> i.getArgument(0));

        RepairHistory history = workflowService.recordTransition(
                repairRequest, to, 1L, "Admin User", "Authorized transition"
        );

        assertThat(repairRequest.getStatus()).isEqualTo(to);
        assertThat(history.getPreviousStatus()).isEqualTo(from);
        assertThat(history.getNewStatus()).isEqualTo(to);
        verify(repairHistoryRepository).save(any(RepairHistory.class));
    }

    @Test
    @DisplayName("Should throw InvalidWorkflowTransitionException when attempting illegal skip from REQUESTED to COMPLETED")
    void testIllegalSkipTransition() {
        repairRequest.setStatus(RepairStatus.REQUESTED);

        assertThatThrownBy(() ->
                workflowService.recordTransition(repairRequest, RepairStatus.COMPLETED, 1L, "Attacker", "Skip")
        ).isInstanceOf(InvalidWorkflowTransitionException.class)
                .hasMessageContaining("Invalid workflow transition from 'REQUESTED' to 'COMPLETED'");
    }

    @Test
    @DisplayName("Should throw InvalidWorkflowTransitionException when trying to assign a REJECTED claim")
    void testCannotAssignRejectedClaim() {
        repairRequest.setStatus(RepairStatus.REJECTED);

        assertThatThrownBy(() ->
                workflowService.recordTransition(repairRequest, RepairStatus.ASSIGNED, 1L, "Admin", "Dispatch")
        ).isInstanceOf(InvalidWorkflowTransitionException.class);
    }

    @Test
    @DisplayName("Should block moving a COMPLETED repair back to IN_REPAIR (Terminal State)")
    void testCompletedIsTerminal() {
        repairRequest.setStatus(RepairStatus.COMPLETED);

        assertThatThrownBy(() ->
                workflowService.recordTransition(repairRequest, RepairStatus.IN_REPAIR, 2L, "Tech", "Reopen")
        ).isInstanceOf(InvalidWorkflowTransitionException.class);
    }
}
