package com.revivio.repair;

import jakarta.validation.constraints.NotNull;

public record ReviewRequest(
        @NotNull(message = "Approval decision is required")
        boolean approved,
        CoverageDecision coverageDecision,
        String coverageDecisionReason,
        String rejectionReason,
        String adminNotes
) {}
