package com.revivio.dashboard;

import com.revivio.common.ApiResponse;
import com.revivio.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/customer/dashboard")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<CustomerDashboardResponse>> getCustomerDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getCustomerDashboard(userDetails.getUserId())));
    }

    @GetMapping("/technician/dashboard")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<TechnicianDashboardResponse>> getTechnicianDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getTechnicianDashboard(userDetails.getUserId())));
    }

    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminDashboard()));
    }

    @GetMapping("/admin/dashboard/analytics/repairs-over-time")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TimeSeriesPoint>>> getRepairsOverTime(
            @RequestParam(defaultValue = "30") int days
    ) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRepairsOverTime(days)));
    }

    @GetMapping("/admin/dashboard/analytics/category-breakdown")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<CategoryCount>>> getCategoryBreakdown() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getCategoryBreakdown()));
    }

    @GetMapping("/admin/dashboard/analytics/technician-workload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TechnicianWorkloadItem>>> getTechnicianWorkload() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getTechnicianWorkload()));
    }

    @GetMapping("/admin/dashboard/analytics/status-distribution")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<StatusDistributionItem>>> getStatusDistribution() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStatusDistribution()));
    }
}
