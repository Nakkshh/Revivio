package com.revivio.warranty;

import java.time.LocalDate;

public record WarrantyResponse(
        Long id,
        LocalDate startDate,
        LocalDate endDate,
        WarrantyStatus status,
        String policyName,
        int durationMonths,
        CoverageType coverageType,
        String voidReason
) {
    public static WarrantyResponse from(Warranty w) {
        return new WarrantyResponse(
                w.getId(),
                w.getStartDate(),
                w.getEndDate(),
                w.getStatus(),
                w.getWarrantyPolicy() != null ? w.getWarrantyPolicy().getName() : "Standard",
                w.getWarrantyPolicy() != null ? w.getWarrantyPolicy().getDurationMonths() : 12,
                w.getWarrantyPolicy() != null ? w.getWarrantyPolicy().getCoverageType() : CoverageType.STANDARD,
                w.getVoidReason()
        );
    }
}
