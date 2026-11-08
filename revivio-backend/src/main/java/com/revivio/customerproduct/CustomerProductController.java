package com.revivio.customerproduct;

import com.revivio.common.ApiResponse;
import com.revivio.common.PageResponse;
import com.revivio.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer-products")
@RequiredArgsConstructor
public class CustomerProductController {

    private final CustomerProductService customerProductService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<CustomerProductResponse>> registerProduct(
            @Valid @RequestBody CustomerProductRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        CustomerProductResponse response = customerProductService.registerProduct(request, userDetails.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Device registered and warranty activated successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PageResponse<CustomerProductResponse>>> getMyProducts(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(customerProductService.getMyProducts(userDetails.getUserId(), pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<CustomerProductResponse>> getMyProductById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(customerProductService.getMyProductById(id, userDetails.getUserId())));
    }
}
