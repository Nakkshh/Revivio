package com.revivio.repair;

import com.revivio.exception.InvalidWorkflowTransitionException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RepairWorkflowService {

    private final RepairHistoryRepository repairHistoryRepository;

    private static final Map<RepairStatus, Set<RepairStatus>> ALLOWED_TRANSITIONS = Map.of(
            RepairStatus.REQUESTED, Set.of(RepairStatus.UNDER_REVIEW),
            RepairStatus.UNDER_REVIEW, Set.of(RepairStatus.APPROVED, RepairStatus.REJECTED),
            RepairStatus.APPROVED, Set.of(RepairStatus.ASSIGNED),
            RepairStatus.ASSIGNED, Set.of(RepairStatus.IN_REPAIR),
            RepairStatus.IN_REPAIR, Set.of(RepairStatus.COMPLETED),
            RepairStatus.COMPLETED, Set.of(), // Terminal
            RepairStatus.REJECTED, Set.of()   // Terminal
    );

    public void validateTransition(RepairStatus currentStatus, RepairStatus targetStatus) {
        Set<RepairStatus> allowed = ALLOWED_TRANSITIONS.get(currentStatus);
        if (allowed == null || !allowed.contains(targetStatus)) {
            throw new InvalidWorkflowTransitionException(
                    currentStatus != null ? currentStatus.name() : "NONE",
                    targetStatus != null ? targetStatus.name() : "NONE"
            );
        }
    }

    @Transactional
    public RepairHistory recordTransition(RepairRequest request, RepairStatus newStatus, Long actorId, String actorName, String comment) {
        validateTransition(request.getStatus(), newStatus);

        RepairHistory history = RepairHistory.builder()
                .repairRequest(request)
                .previousStatus(request.getStatus())
                .newStatus(newStatus)
                .actorId(actorId)
                .actorName(actorName)
                .comment(comment)
                .build();

        request.setStatus(newStatus);
        return repairHistoryRepository.save(history);
    }
}
