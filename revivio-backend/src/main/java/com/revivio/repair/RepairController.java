package com.revivio.repair;

import com.revivio.common.ApiResponse;
import com.revivio.common.PageResponse;
import com.revivio.security.CustomUserDetails;
import com.revivio.user.Role;
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
@RequestMapping("/repairs")
@RequiredArgsConstructor
public class RepairController {

    private final RepairService repairService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> createRepairRequest(
            @Valid @RequestBody RepairRequestCreate request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RepairRequestResponse response = repairService.createRepairRequest(request, userDetails.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Repair ticket created successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PageResponse<RepairRequestResponse>>> getMyRepairs(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(repairService.getMyRepairs(userDetails.getUserId(), pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> getRepairById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Role role = Role.valueOf(userDetails.getRole());
        return ResponseEntity.ok(ApiResponse.success(repairService.getRepairById(id, userDetails.getUserId(), role)));
    }
}
