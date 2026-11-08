package com.revivio.customerproduct;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CustomerProductRequest(
        @NotNull(message = "Product ID is required")
        Long productId,

        @NotBlank(message = "Serial number is required")
        String serialNumber,

        @NotNull(message = "Purchase date is required")
        @PastOrPresent(message = "Purchase date cannot be in the future")
        LocalDate purchaseDate,

        BigDecimal purchasePrice,
        String additionalNotes,

        @NotNull(message = "Warranty policy ID is required")
        Long warrantyPolicyId
) {}
