package com.revivio.repair;

import jakarta.validation.constraints.NotNull;

public record AssignTechnicianRequest(
        @NotNull(message = "Technician ID is required")
        Long technicianId,
        String notes
) {}
