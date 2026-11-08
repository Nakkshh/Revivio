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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/repairs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRepairController {

    private final RepairService repairService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<RepairRequestResponse>>> getAllRepairs(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(repairService.getAllRepairsForAdmin(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> getRepairById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(repairService.getRepairById(id, userDetails.getUserId(), Role.ADMIN)));
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> reviewRepair(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RepairRequestResponse response = repairService.reviewRepair(id, request, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Repair request review recorded", response));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> assignTechnician(
            @PathVariable Long id,
            @Valid @RequestBody AssignTechnicianRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RepairRequestResponse response = repairService.assignTechnician(id, request, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Technician assigned successfully", response));
    }
}
