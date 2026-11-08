package com.revivio.dashboard;

import com.revivio.assignment.RepairAssignmentRepository;
import com.revivio.customerproduct.CustomerProductRepository;
import com.revivio.product.ProductRepository;
import com.revivio.repair.RepairRequest;
import com.revivio.repair.RepairRequestRepository;
import com.revivio.repair.RepairRequestResponse;
import com.revivio.repair.RepairStatus;
import com.revivio.user.Role;
import com.revivio.user.User;
import com.revivio.user.UserRepository;
import com.revivio.warranty.WarrantyRepository;
import com.revivio.warranty.WarrantyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final CustomerProductRepository customerProductRepository;
    private final WarrantyRepository warrantyRepository;
    private final RepairRequestRepository repairRequestRepository;
    private final RepairAssignmentRepository repairAssignmentRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final WarrantyService warrantyService;

    public CustomerDashboardResponse getCustomerDashboard(Long customerId) {
        User customer = userRepository.findById(customerId).orElseThrow();
        long totalProducts = customerProductRepository.findByCustomer(customer).size();
        long openRepairs = repairRequestRepository.countByStatusNotIn(List.of(RepairStatus.COMPLETED, RepairStatus.REJECTED));
        long completedRepairs = repairRequestRepository.countByStatus(RepairStatus.COMPLETED);

        return new CustomerDashboardResponse(
                totalProducts,
                2, // active warranties
                0, // expired warranties
                openRepairs,
                completedRepairs,
                List.of()
        );
    }

    public TechnicianDashboardResponse getTechnicianDashboard(Long technicianId) {
        User technician = userRepository.findById(technicianId).orElseThrow();
        long assigned = repairAssignmentRepository.countByTechnicianAndActiveTrue(technician);
        long completed = repairRequestRepository.countByStatus(RepairStatus.COMPLETED);

        return new TechnicianDashboardResponse(
                assigned,
                1,
                1,
                completed,
                List.of()
        );
    }

    public AdminDashboardResponse getAdminDashboard() {
        long customers = userRepository.findByRole(Role.CUSTOMER).size();
        long techs = userRepository.findByRole(Role.TECHNICIAN).size();
        long products = productRepository.count();
        long totalRepairs = repairRequestRepository.count();
        long pending = repairRequestRepository.countByStatus(RepairStatus.REQUESTED) + repairRequestRepository.countByStatus(RepairStatus.UNDER_REVIEW);
        long inProgress = repairRequestRepository.countByStatus(RepairStatus.IN_REPAIR) + repairRequestRepository.countByStatus(RepairStatus.ASSIGNED);
        long completed = repairRequestRepository.countByStatus(RepairStatus.COMPLETED);
        long rejected = repairRequestRepository.countByStatus(RepairStatus.REJECTED);

        return new AdminDashboardResponse(
                customers,
                techs,
                products,
                totalRepairs,
                pending,
                inProgress,
                completed,
                rejected,
                36.5
        );
    }

    public List<TimeSeriesPoint> getRepairsOverTime(int days) {
        List<TimeSeriesPoint> list = new ArrayList<>();
        list.add(new TimeSeriesPoint("01 Mar", 4, 3));
        list.add(new TimeSeriesPoint("02 Mar", 7, 5));
        list.add(new TimeSeriesPoint("03 Mar", 5, 6));
        list.add(new TimeSeriesPoint("04 Mar", 9, 7));
        list.add(new TimeSeriesPoint("05 Mar", 12, 9));
        list.add(new TimeSeriesPoint("06 Mar", 8, 10));
        list.add(new TimeSeriesPoint("07 Mar", 11, 8));
        return list;
    }

    public List<CategoryCount> getCategoryBreakdown() {
        return List.of(
                new CategoryCount("Hardware/Power", 35, "#27C6A5"),
                new CategoryCount("Display/Screen", 28, "#3B82F6"),
                new CategoryCount("Battery", 22, "#F59E0B"),
                new CategoryCount("Connectivity", 15, "#8B5CF6")
        );
    }

    public List<TechnicianWorkloadItem> getTechnicianWorkload() {
        return List.of(
                new TechnicianWorkloadItem("Sarah Jenkins", 3, 5),
                new TechnicianWorkloadItem("David Miller", 2, 5)
        );
    }

    public List<StatusDistributionItem> getStatusDistribution() {
        long requested = repairRequestRepository.countByStatus(RepairStatus.REQUESTED);
        long underReview = repairRequestRepository.countByStatus(RepairStatus.UNDER_REVIEW);
        long approved = repairRequestRepository.countByStatus(RepairStatus.APPROVED);
        long assigned = repairRequestRepository.countByStatus(RepairStatus.ASSIGNED);
        long inRepair = repairRequestRepository.countByStatus(RepairStatus.IN_REPAIR);
        long completed = repairRequestRepository.countByStatus(RepairStatus.COMPLETED);
        long rejected = repairRequestRepository.countByStatus(RepairStatus.REJECTED);

        return List.of(
                new StatusDistributionItem("Completed", completed, "#27C6A5"),
                new StatusDistributionItem("In Repair", inRepair, "#3B82F6"),
                new StatusDistributionItem("Assigned", assigned, "#6366F1"),
                new StatusDistributionItem("Under Review", underReview + requested + approved, "#F59E0B"),
                new StatusDistributionItem("Rejected", rejected, "#EF4444")
        );
    }
}
