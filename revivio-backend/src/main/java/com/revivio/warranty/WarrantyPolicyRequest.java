package com.revivio.warranty;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record WarrantyPolicyRequest(
        @NotBlank(message = "Policy name is required")
        String name,

        String description,

        @Min(value = 1, message = "Duration must be at least 1 month")
        @Max(value = 120, message = "Duration cannot exceed 120 months")
        int durationMonths,

        @NotNull(message = "Coverage type is required")
        CoverageType coverageType,

        boolean coversPhysicalDamage,
        boolean coversWaterDamage
) {}
