package com.revivio.brand;

import java.time.Instant;

public record BrandResponse(
        Long id,
        String name,
        String description,
        String logoUrl,
        boolean active,
        Instant createdAt
) {
    public static BrandResponse from(Brand b) {
        return new BrandResponse(
                b.getId(),
                b.getName(),
                b.getDescription(),
                b.getLogoUrl(),
                b.isActive(),
                b.getCreatedAt()
        );
    }
}
