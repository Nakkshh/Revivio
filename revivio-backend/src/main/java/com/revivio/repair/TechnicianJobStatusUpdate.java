package com.revivio.repair;

import jakarta.validation.constraints.NotNull;

public record TechnicianJobStatusUpdate(
        @NotNull(message = "Target status is required")
        RepairStatus newStatus,
        String comment
) {}
