package com.revivio.customerproduct;

import com.revivio.product.ProductResponse;
import com.revivio.warranty.WarrantyResponse;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record CustomerProductResponse(
        Long id,
        ProductResponse product,
        String serialNumber,
        LocalDate purchaseDate,
        BigDecimal purchasePrice,
        String additionalNotes,
        boolean invoiceVerified,
        WarrantyResponse warranty,
        Instant createdAt
) {
    public static CustomerProductResponse from(CustomerProduct cp, WarrantyResponse warranty) {
        return new CustomerProductResponse(
                cp.getId(),
                cp.getProduct() != null ? ProductResponse.from(cp.getProduct()) : null,
                cp.getSerialNumber(),
                cp.getPurchaseDate(),
                cp.getPurchasePrice(),
                cp.getAdditionalNotes(),
                cp.isInvoiceVerified(),
                warranty,
                cp.getCreatedAt()
        );
    }
}
