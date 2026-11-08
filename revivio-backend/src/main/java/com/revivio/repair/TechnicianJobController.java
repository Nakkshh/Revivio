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
@RequestMapping("/technician/jobs")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
public class TechnicianJobController {

    private final RepairService repairService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<RepairRequestResponse>>> getAssignedJobs(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(repairService.getAssignedJobsForTechnician(userDetails.getUserId(), pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Role role = Role.valueOf(userDetails.getRole());
        return ResponseEntity.ok(ApiResponse.success(repairService.getRepairById(id, userDetails.getUserId(), role)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody TechnicianJobStatusUpdate update,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RepairRequestResponse response = repairService.updateTechnicianStatus(id, userDetails.getUserId(), update);
        return ResponseEntity.ok(ApiResponse.success("Job status updated", response));
    }

    @PostMapping("/{id}/diagnosis")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> submitDiagnosis(
            @PathVariable Long id,
            @Valid @RequestBody DiagnosisRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RepairRequestResponse response = repairService.submitDiagnosis(id, userDetails.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.success("Diagnostic notes recorded", response));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> completeRepair(
            @PathVariable Long id,
            @Valid @RequestBody CompleteRepairRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RepairRequestResponse response = repairService.completeRepair(id, userDetails.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.success("Repair marked as completed and certified", response));
    }
}
