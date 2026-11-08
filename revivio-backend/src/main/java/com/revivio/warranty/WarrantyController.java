package com.revivio.warranty;

import com.revivio.common.ApiResponse;
import com.revivio.customerproduct.CustomerProduct;
import com.revivio.customerproduct.CustomerProductRepository;
import com.revivio.exception.ResourceNotFoundException;
import com.revivio.exception.UnauthorizedAccessException;
import com.revivio.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/warranties")
@RequiredArgsConstructor
public class WarrantyController {

    private final WarrantyService warrantyService;
    private final CustomerProductRepository customerProductRepository;

    @GetMapping("/customer-product/{customerProductId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<WarrantyResponse>> getWarrantyByCustomerProduct(
            @PathVariable Long customerProductId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        CustomerProduct cp = customerProductRepository.findById(customerProductId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerProduct", "id", customerProductId));

        // Ownership verification for customers
        if ("CUSTOMER".equals(userDetails.getRole()) && !cp.getCustomer().getId().equals(userDetails.getUserId())) {
            throw new UnauthorizedAccessException("You are not authorized to view warranty information for this device.");
        }

        return ResponseEntity.ok(ApiResponse.success(warrantyService.getWarrantyByCustomerProduct(cp)));
    }
}
