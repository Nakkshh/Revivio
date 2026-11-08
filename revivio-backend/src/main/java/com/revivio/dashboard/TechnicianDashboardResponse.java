package com.revivio.dashboard;

import com.revivio.repair.RepairRequestResponse;

import java.util.List;

public record TechnicianDashboardResponse(
        long totalAssigned,
        long pendingJobs,
        long activeRepairs,
        long completedJobs,
        List<RepairRequestResponse> recentJobs
) {}
