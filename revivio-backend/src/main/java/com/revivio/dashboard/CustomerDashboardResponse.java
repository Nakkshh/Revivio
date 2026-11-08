package com.revivio.dashboard;

import com.revivio.repair.RepairRequestResponse;

import java.util.List;

public record CustomerDashboardResponse(
        long totalProducts,
        long activeWarranties,
        long expiredWarranties,
        long openRepairs,
        long completedRepairs,
        List<RepairRequestResponse> recentRepairs
) {}
