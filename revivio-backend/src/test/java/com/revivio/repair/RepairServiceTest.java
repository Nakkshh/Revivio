package com.revivio.repair;

import com.revivio.assignment.RepairAssignment;
import com.revivio.assignment.RepairAssignmentRepository;
import com.revivio.brand.Brand;
import com.revivio.category.Category;
import com.revivio.customerproduct.CustomerProduct;
import com.revivio.customerproduct.CustomerProductRepository;
import com.revivio.exception.BusinessRuleException;
import com.revivio.exception.UnauthorizedAccessException;
import com.revivio.notification.NotificationService;
import com.revivio.product.Product;
import com.revivio.user.Role;
import com.revivio.user.User;
import com.revivio.user.UserRepository;
import com.revivio.warranty.CoverageType;
import com.revivio.warranty.WarrantyResponse;
import com.revivio.warranty.WarrantyService;
import com.revivio.warranty.WarrantyStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RepairServiceTest {

    @Mock
    private RepairRequestRepository repairRequestRepository;

    @Mock
    private RepairHistoryRepository repairHistoryRepository;

    @Mock
    private RepairAssignmentRepository repairAssignmentRepository;

    @Mock
    private CustomerProductRepository customerProductRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WarrantyService warrantyService;

    @Mock
    private RepairWorkflowService workflowService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private RepairService repairService;

    private User customer;
    private User technician;
    private User admin;
    private Product product;
    private CustomerProduct customerProduct;
    private WarrantyResponse mockWarrantyResponse;

    @BeforeEach
    void setUp() {
        customer = User.builder()
                .id(1L)
                .email("cust@example.com")
                .firstName("James")
                .lastName("Holden")
                .role(Role.CUSTOMER)
                .build();

        technician = User.builder()
                .id(2L)
                .email("tech@example.com")
                .firstName("Amos")
                .lastName("Burton")
                .role(Role.TECHNICIAN)
                .build();

        admin = User.builder()
                .id(3L)
                .email("admin@example.com")
                .firstName("Chrisjen")
                .lastName("Avasarala")
                .role(Role.ADMIN)
                .build();

        Brand brand = Brand.builder().id(10L).name("Apple").build();
        Category cat = Category.builder().id(20L).name("Laptops").build();

        product = Product.builder()
                .id(100L)
                .name("MacBook Pro 16")
                .modelNumber("MBP-16")
                .brand(brand)
                .category(cat)
                .build();

        customerProduct = CustomerProduct.builder()
                .id(50L)
                .customer(customer)
                .product(product)
                .serialNumber("MBP-2025-00123")
                .purchaseDate(LocalDate.now().minusMonths(3))
                .invoiceVerified(true)
                .build();

        mockWarrantyResponse = new WarrantyResponse(
                100L, LocalDate.now().minusMonths(3), LocalDate.now().plusMonths(9),
                WarrantyStatus.ACTIVE, "Standard 12M", 12, CoverageType.STANDARD, null
        );
    }

    @Test
    @DisplayName("Should successfully lodge repair request and generate reference code")
    void testCreateRepairRequestSuccess() {
        RepairRequestCreate request = new RepairRequestCreate(
                50L,
                IssueCategory.HARDWARE,
                "Screen flickering and horizontal lines",
                "Display shows green horizontal lines when hinge is moved past 90 degrees.",
                Priority.HIGH,
                "Need quick turnaround"
        );

        when(customerProductRepository.findById(50L)).thenReturn(Optional.of(customerProduct));
        when(repairRequestRepository.existsByCustomerProductIdAndStatusNotIn(eq(50L), anyList())).thenReturn(false);
        when(repairRequestRepository.findMaxReferenceNumberForYear(anyString())).thenReturn(null);
        when(warrantyService.getWarrantyByCustomerProduct(customerProduct)).thenReturn(mockWarrantyResponse);

        when(repairRequestRepository.save(any(RepairRequest.class))).thenAnswer(invocation -> {
            RepairRequest r = invocation.getArgument(0);
            r.setId(999L);
            r.setCreatedAt(Instant.now());
            return r;
        });

        RepairRequestResponse response = repairService.createRepairRequest(request, 1L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(999L);
        assertThat(response.referenceNumber()).startsWith("RV-");
        assertThat(response.status()).isEqualTo(RepairStatus.REQUESTED);
        assertThat(response.issueTitle()).isEqualTo("Screen flickering and horizontal lines");
        assertThat(response.adminNotes()).isNull(); // Customer view masks adminNotes

        verify(repairRequestRepository, times(1)).save(any(RepairRequest.class));
        verify(repairHistoryRepository, times(1)).save(any(RepairHistory.class));
        verify(notificationService, times(1)).createNotification(eq(customer), any(), anyString(), anyString(), eq(999L), anyString());
    }

    @Test
    @DisplayName("Should reject repair creation if user is not the verified hardware owner")
    void testCreateRepairUnauthorizedOwner() {
        RepairRequestCreate request = new RepairRequestCreate(
                50L,
                IssueCategory.HARDWARE,
                "Broken screen",
                "Screen is completely shattered after drop.",
                Priority.URGENT,
                null
        );

        when(customerProductRepository.findById(50L)).thenReturn(Optional.of(customerProduct));

        // Attempting to lodge repair as user 999 instead of customer 1
        assertThatThrownBy(() -> repairService.createRepairRequest(request, 999L))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessageContaining("You cannot submit a repair request for hardware you do not own");

        verify(repairRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should block concurrent active repairs for the same physical device serial")
    void testCreateRepairConcurrentActiveTicket() {
        RepairRequestCreate request = new RepairRequestCreate(
                50L,
                IssueCategory.BATTERY,
                "Battery swelling",
                "Battery does not hold charge for more than 15 minutes.",
                Priority.MEDIUM,
                null
        );

        when(customerProductRepository.findById(50L)).thenReturn(Optional.of(customerProduct));
        when(repairRequestRepository.existsByCustomerProductIdAndStatusNotIn(eq(50L), anyList())).thenReturn(true);

        assertThatThrownBy(() -> repairService.createRepairRequest(request, 1L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Only one active ticket is permitted per unit");

        verify(repairRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should approve claim, record workflow transitions and notify customer")
    void testReviewRepairApproval() {
        RepairRequest repair = RepairRequest.builder()
                .id(777L)
                .referenceNumber("RV-2026-00010")
                .customer(customer)
                .customerProduct(customerProduct)
                .status(RepairStatus.REQUESTED)
                .build();

        ReviewRequest reviewRequest = new ReviewRequest(
                true,
                CoverageDecision.COVERED_UNDER_WARRANTY,
                "Within 12M manufacturer warranty",
                null,
                "Internal: priority express turnaround"
        );

        when(repairRequestRepository.findById(777L)).thenReturn(Optional.of(repair));
        when(userRepository.findById(3L)).thenReturn(Optional.of(admin));
        when(repairRequestRepository.save(any(RepairRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(warrantyService.getWarrantyByCustomerProduct(customerProduct)).thenReturn(mockWarrantyResponse);

        RepairRequestResponse response = repairService.reviewRepair(777L, reviewRequest, 3L);

        assertThat(response).isNotNull();
        assertThat(repair.getCoverageDecision()).isEqualTo(CoverageDecision.COVERED_UNDER_WARRANTY);
        assertThat(repair.getAdminNotes()).isEqualTo("Internal: priority express turnaround");

        verify(workflowService, times(1)).recordTransition(eq(repair), eq(RepairStatus.UNDER_REVIEW), eq(3L), anyString(), anyString());
        verify(workflowService, times(1)).recordTransition(eq(repair), eq(RepairStatus.APPROVED), eq(3L), anyString(), anyString());
        verify(notificationService, times(1)).createNotification(eq(customer), any(), anyString(), anyString(), eq(777L), anyString());
    }

    @Test
    @DisplayName("Should require rejection reason when denying repair warranty claim")
    void testReviewRepairRejectionRequiresReason() {
        RepairRequest repair = RepairRequest.builder()
                .id(777L)
                .referenceNumber("RV-2026-00010")
                .customer(customer)
                .customerProduct(customerProduct)
                .status(RepairStatus.REQUESTED)
                .build();

        ReviewRequest reviewRequest = new ReviewRequest(
                false,
                CoverageDecision.DENIED,
                null,
                "", // Blank rejection reason
                null
        );

        when(repairRequestRepository.findById(777L)).thenReturn(Optional.of(repair));
        when(userRepository.findById(3L)).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> repairService.reviewRepair(777L, reviewRequest, 3L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("A rejection reason is mandatory");

        verify(repairRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should assign technician to approved repair and notify both parties")
    void testAssignTechnicianSuccess() {
        RepairRequest repair = RepairRequest.builder()
                .id(777L)
                .referenceNumber("RV-2026-00010")
                .customer(customer)
                .customerProduct(customerProduct)
                .status(RepairStatus.APPROVED)
                .build();

        AssignTechnicianRequest assignRequest = new AssignTechnicianRequest(2L, "Check battery calibration");

        when(repairRequestRepository.findById(777L)).thenReturn(Optional.of(repair));
        when(userRepository.findById(2L)).thenReturn(Optional.of(technician));
        when(userRepository.findById(3L)).thenReturn(Optional.of(admin));
        when(repairAssignmentRepository.findByRepairRequestAndActiveTrue(repair)).thenReturn(Optional.empty());
        when(repairRequestRepository.save(any(RepairRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(warrantyService.getWarrantyByCustomerProduct(customerProduct)).thenReturn(mockWarrantyResponse);

        RepairRequestResponse response = repairService.assignTechnician(777L, assignRequest, 3L);

        assertThat(response).isNotNull();
        verify(workflowService, times(1)).recordTransition(eq(repair), eq(RepairStatus.ASSIGNED), eq(3L), anyString(), anyString());
        verify(repairAssignmentRepository, times(1)).save(any(RepairAssignment.class));
        verify(notificationService, times(1)).createNotification(eq(customer), any(), anyString(), anyString(), eq(777L), anyString());
        verify(notificationService, times(1)).createNotification(eq(technician), any(), anyString(), anyString(), eq(777L), anyString());
    }

    @Test
    @DisplayName("Should reject assigning technician if repair is not yet in APPROVED status")
    void testAssignTechnicianNotApproved() {
        RepairRequest repair = RepairRequest.builder()
                .id(777L)
                .status(RepairStatus.REQUESTED) // Not yet approved
                .build();

        AssignTechnicianRequest assignRequest = new AssignTechnicianRequest(2L, "Bench check");

        when(repairRequestRepository.findById(777L)).thenReturn(Optional.of(repair));

        assertThatThrownBy(() -> repairService.assignTechnician(777L, assignRequest, 3L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Only APPROVED service requests can be assigned");

        verify(repairAssignmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should mask adminNotes when customer views repair details")
    void testGetRepairByIdMasksAdminNotesForCustomer() {
        RepairRequest repair = RepairRequest.builder()
                .id(777L)
                .referenceNumber("RV-2026-00010")
                .customer(customer)
                .customerProduct(customerProduct)
                .status(RepairStatus.UNDER_REVIEW)
                .adminNotes("Confidential internal fraud review note")
                .build();

        when(repairRequestRepository.findById(777L)).thenReturn(Optional.of(repair));
        when(warrantyService.getWarrantyByCustomerProduct(customerProduct)).thenReturn(mockWarrantyResponse);
        when(repairAssignmentRepository.findByRepairRequestAndActiveTrue(repair)).thenReturn(Optional.empty());
        when(repairHistoryRepository.findByRepairRequestOrderByCreatedAtAsc(repair)).thenReturn(Collections.emptyList());

        // As CUSTOMER
        RepairRequestResponse customerResp = repairService.getRepairById(777L, 1L, Role.CUSTOMER);
        assertThat(customerResp.adminNotes()).isNull();

        // As ADMIN
        RepairRequestResponse adminResp = repairService.getRepairById(777L, 3L, Role.ADMIN);
        assertThat(adminResp.adminNotes()).isEqualTo("Confidential internal fraud review note");
    }
}
