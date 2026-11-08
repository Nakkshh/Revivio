package com.revivio.warranty;

import com.revivio.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class WarrantyPolicyController {

    private final WarrantyPolicyService warrantyPolicyService;

    @GetMapping("/warranty-policies")
    public ResponseEntity<ApiResponse<List<WarrantyPolicyResponse>>> getAllActivePolicies() {
        return ResponseEntity.ok(ApiResponse.success(warrantyPolicyService.getAllActivePolicies()));
    }

    @GetMapping("/warranty-policies/{id}")
    public ResponseEntity<ApiResponse<WarrantyPolicyResponse>> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(warrantyPolicyService.getPolicyById(id)));
    }

    @PostMapping("/admin/warranty-policies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<WarrantyPolicyResponse>> createPolicy(@Valid @RequestBody WarrantyPolicyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Warranty policy created successfully", warrantyPolicyService.createPolicy(request)));
    }

    @PutMapping("/admin/warranty-policies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<WarrantyPolicyResponse>> updatePolicy(
            @PathVariable Long id,
            @Valid @RequestBody WarrantyPolicyRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Warranty policy updated successfully", warrantyPolicyService.updatePolicy(id, request)));
    }

    @DeleteMapping("/admin/warranty-policies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePolicy(@PathVariable Long id) {
        warrantyPolicyService.deletePolicy(id);
        return ResponseEntity.ok(ApiResponse.success("Warranty policy deactivated", null));
    }
}
