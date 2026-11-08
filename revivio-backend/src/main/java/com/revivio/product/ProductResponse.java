package com.revivio.product;

import com.revivio.brand.BrandResponse;
import com.revivio.category.CategoryResponse;

import java.time.Instant;

public record ProductResponse(
        Long id,
        String name,
        String modelNumber,
        String description,
        String imageUrl,
        BrandResponse brand,
        CategoryResponse category,
        boolean active,
        Instant createdAt
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getModelNumber(),
                p.getDescription(),
                p.getImageUrl(),
                p.getBrand() != null ? BrandResponse.from(p.getBrand()) : null,
                p.getCategory() != null ? CategoryResponse.from(p.getCategory()) : null,
                p.isActive(),
                p.getCreatedAt()
        );
    }
}
