package com.revivio.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductRequest(
        @NotBlank(message = "Product name is required")
        String name,

        @NotBlank(message = "Model number is required")
        String modelNumber,

        String description,
        String imageUrl,

        @NotNull(message = "Brand ID is required")
        Long brandId,

        @NotNull(message = "Category ID is required")
        Long categoryId
) {}
