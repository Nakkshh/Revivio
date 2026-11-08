package com.revivio.warranty;

import java.time.Instant;

public record WarrantyPolicyResponse(
        Long id,
        String name,
        String description,
        int durationMonths,
        CoverageType coverageType,
        boolean coversPhysicalDamage,
        boolean coversWaterDamage,
        boolean active,
        Instant createdAt
) {
    public static WarrantyPolicyResponse from(WarrantyPolicy wp) {
        return new WarrantyPolicyResponse(
                wp.getId(),
                wp.getName(),
                wp.getDescription(),
                wp.getDurationMonths(),
                wp.getCoverageType(),
                wp.isCoversPhysicalDamage(),
                wp.isCoversWaterDamage(),
                wp.isActive(),
                wp.getCreatedAt()
        );
    }
}
