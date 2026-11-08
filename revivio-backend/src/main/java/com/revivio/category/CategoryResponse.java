package com.revivio.category;

import java.time.Instant;

public record CategoryResponse(
        Long id,
        String name,
        String description,
        String iconName,
        boolean active,
        Instant createdAt
) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(
                c.getId(),
                c.getName(),
                c.getDescription(),
                c.getIconName(),
                c.isActive(),
                c.getCreatedAt()
        );
    }
}
