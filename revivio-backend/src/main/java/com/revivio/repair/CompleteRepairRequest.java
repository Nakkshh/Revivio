package com.revivio.repair;

import jakarta.validation.constraints.NotBlank;

public record CompleteRepairRequest(
        @NotBlank(message = "Itemized repair actions taken must be recorded")
        String repairActions,
        String completionNotes,
        String customerCareInstructions
) {}
