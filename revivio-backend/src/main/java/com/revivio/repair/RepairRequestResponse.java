package com.revivio.repair;

import com.revivio.auth.UserProfileResponse;
import com.revivio.customerproduct.CustomerProductResponse;

import java.time.Instant;
import java.util.List;

public record RepairRequestResponse(
        Long id,
        String referenceNumber,
        UserProfileResponse customer,
        CustomerProductResponse customerProduct,
        IssueCategory issueCategory,
        String issueTitle,
        String issueDescription,
        Priority priority,
        RepairStatus status,
        CoverageDecision coverageDecision,
        String coverageDecisionReason,
        String rejectionReason,
        String adminNotes,
        String technicianNotes,
        String diagnosisNotes,
        String repairActions,
        String completionNotes,
        UserProfileResponse assignedTechnician,
        List<RepairHistoryResponse> history,
        Instant completedAt,
        Instant createdAt,
        Instant updatedAt
) {
    public static RepairRequestResponse from(
            RepairRequest r,
            CustomerProductResponse cpResp,
            UserProfileResponse customerResp,
            UserProfileResponse techResp,
            List<RepairHistoryResponse> hist,
            boolean maskAdminNotes
    ) {
        return new RepairRequestResponse(
                r.getId(),
                r.getReferenceNumber(),
                customerResp,
                cpResp,
                r.getIssueCategory(),
                r.getIssueTitle(),
                r.getIssueDescription(),
                r.getPriority(),
                r.getStatus(),
                r.getCoverageDecision(),
                r.getCoverageDecisionReason(),
                r.getRejectionReason(),
                maskAdminNotes ? null : r.getAdminNotes(), // Strict confidentiality masking
                r.getTechnicianNotes(),
                r.getDiagnosisNotes(),
                r.getRepairActions(),
                r.getCompletionNotes(),
                techResp,
                hist,
                r.getCompletedAt(),
                r.getCreatedAt(),
                r.getUpdatedAt()
        );
    }
}
