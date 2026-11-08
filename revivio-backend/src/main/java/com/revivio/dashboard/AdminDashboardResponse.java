package com.revivio.dashboard;

import java.util.List;

public record AdminDashboardResponse(
        long totalCustomers,
        long totalTechnicians,
        long totalProducts,
        long totalRepairs,
        long pendingRepairs,
        long inProgressRepairs,
        long completedRepairs,
        long rejectedRepairs,
        double avgCompletionTimeHours
) {}
