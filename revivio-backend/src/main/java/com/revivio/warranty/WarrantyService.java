package com.revivio.warranty;

import com.revivio.customerproduct.CustomerProduct;
import com.revivio.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class WarrantyService {

    private final WarrantyRepository warrantyRepository;

    @Transactional
    public Warranty createWarrantyForProduct(CustomerProduct customerProduct, WarrantyPolicy policy) {
        LocalDate startDate = customerProduct.getPurchaseDate();
        LocalDate endDate = startDate.plusMonths(policy.getDurationMonths());

        WarrantyStatus initialStatus = LocalDate.now().isAfter(endDate)
                ? WarrantyStatus.EXPIRED
                : customerProduct.isInvoiceVerified()
                ? WarrantyStatus.ACTIVE
                : WarrantyStatus.PENDING_VERIFICATION;

        Warranty warranty = Warranty.builder()
                .customerProduct(customerProduct)
                .warrantyPolicy(policy)
                .startDate(startDate)
                .endDate(endDate)
                .status(initialStatus)
                .build();

        return warrantyRepository.save(warranty);
    }

    public WarrantyResponse getWarrantyByCustomerProduct(CustomerProduct cp) {
        Warranty warranty = warrantyRepository.findByCustomerProduct(cp)
                .orElseThrow(() -> new ResourceNotFoundException("Warranty", "customerProductId", cp.getId()));

        // Recalculate status dynamically if expired by calendar date
        if (warranty.getStatus() == WarrantyStatus.ACTIVE && LocalDate.now().isAfter(warranty.getEndDate())) {
            warranty.setStatus(WarrantyStatus.EXPIRED);
            warrantyRepository.save(warranty);
        }

        return WarrantyResponse.from(warranty);
    }
}
