package com.revivio.brand;

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
public class BrandController {

    private final BrandService brandService;

    @GetMapping("/brands")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getAllBrands() {
        return ResponseEntity.ok(ApiResponse.success(brandService.getAllActiveBrands()));
    }

    @GetMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> getBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(brandService.getBrandById(id)));
    }

    @PostMapping("/admin/brands")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BrandResponse>> createBrand(@Valid @RequestBody BrandRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Brand created successfully", brandService.createBrand(request)));
    }

    @PutMapping("/admin/brands/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BrandResponse>> updateBrand(@PathVariable Long id, @Valid @RequestBody BrandRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Brand updated successfully", brandService.updateBrand(id, request)));
    }

    @DeleteMapping("/admin/brands/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(ApiResponse.success("Brand deactivated successfully", null));
    }
}
