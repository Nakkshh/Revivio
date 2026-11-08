package com.revivio.repair;

import com.revivio.assignment.RepairAssignment;
import com.revivio.assignment.RepairAssignmentRepository;
import com.revivio.auth.UserProfileResponse;
import com.revivio.common.PageResponse;
import com.revivio.customerproduct.CustomerProduct;
import com.revivio.customerproduct.CustomerProductRepository;
import com.revivio.customerproduct.CustomerProductResponse;
import com.revivio.exception.BusinessRuleException;
import com.revivio.exception.ResourceNotFoundException;
import com.revivio.exception.UnauthorizedAccessException;
import com.revivio.notification.NotificationService;
import com.revivio.notification.NotificationType;
import com.revivio.user.Role;
import com.revivio.user.User;
import com.revivio.user.UserRepository;
import com.revivio.warranty.WarrantyResponse;
import com.revivio.warranty.WarrantyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RepairService {

    private final RepairRequestRepository repairRequestRepository;
    private final RepairHistoryRepository repairHistoryRepository;
    private final RepairAssignmentRepository repairAssignmentRepository;
    private final CustomerProductRepository customerProductRepository;
    private final UserRepository userRepository;
    private final WarrantyService warrantyService;
    private final RepairWorkflowService workflowService;
    private final NotificationService notificationService;

    @Transactional
    public RepairRequestResponse createRepairRequest(RepairRequestCreate request, Long customerId) {
        CustomerProduct cp = customerProductRepository.findById(request.customerProductId())
                .orElseThrow(() -> new ResourceNotFoundException("CustomerProduct", "id", request.customerProductId()));

        if (!cp.getCustomer().getId().equals(customerId)) {
            throw new UnauthorizedAccessException("You cannot submit a repair request for hardware you do not own.");
        }

        // Business Rule: Prevent concurrent open repair requests on the same device serial
        boolean hasActive = repairRequestRepository.existsByCustomerProductIdAndStatusNotIn(
                cp.getId(),
                List.of(RepairStatus.COMPLETED, RepairStatus.REJECTED)
        );
        if (hasActive) {
            throw new BusinessRuleException("An open service ticket is already active for device serial " + cp.getSerialNumber() + ". Only one active ticket is permitted per unit.");
        }

        User customer = cp.getCustomer();
        String referenceNumber = generateReferenceNumber();

        RepairRequest repair = RepairRequest.builder()
                .referenceNumber(referenceNumber)
                .customer(customer)
                .customerProduct(cp)
                .issueCategory(request.issueCategory())
                .issueTitle(request.issueTitle().trim())
                .issueDescription(request.issueDescription().trim())
                .priority(request.priority())
                .status(RepairStatus.REQUESTED)
                .build();

        RepairRequest saved = repairRequestRepository.save(repair);

        // Record initial history
        RepairHistory initialHistory = RepairHistory.builder()
                .repairRequest(saved)
                .previousStatus(null)
                .newStatus(RepairStatus.REQUESTED)
                .actorId(customer.getId())
                .actorName(customer.getFirstName() + " " + customer.getLastName())
                .comment("Claim submitted via customer portal")
                .build();
        repairHistoryRepository.save(initialHistory);

        // Trigger notification
        notificationService.createNotification(
                customer,
                NotificationType.REPAIR_SUBMITTED,
                "Repair Request Initialized",
                "Your service ticket " + referenceNumber + " has been lodged for review.",
                saved.getId(),
                "REPAIR_REQUEST"
        );

        return mapToResponse(saved, true, true);
    }

    public PageResponse<RepairRequestResponse> getMyRepairs(Long customerId, Pageable pageable) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        Page<RepairRequestResponse> page = repairRequestRepository.findByCustomer(customer, pageable)
                .map(r -> mapToResponse(r, false, true));
        return PageResponse.from(page);
    }

    public RepairRequestResponse getRepairById(Long repairId, Long requestingUserId, Role role) {
        RepairRequest repair = repairRequestRepository.findById(repairId)
                .orElseThrow(() -> new ResourceNotFoundException("RepairRequest", "id", repairId));

        // Ownership checks
        if (role == Role.CUSTOMER && !repair.getCustomer().getId().equals(requestingUserId)) {
            throw new UnauthorizedAccessException("Access denied. You do not own this service ticket.");
        }

        if (role == Role.TECHNICIAN) {
            Optional<RepairAssignment> assignment = repairAssignmentRepository.findByRepairRequestAndActiveTrue(repair);
            if (assignment.isEmpty() || !assignment.get().getTechnician().getId().equals(requestingUserId)) {
                throw new UnauthorizedAccessException("Access denied. This repair is not allocated to your workbench.");
            }
        }

        boolean maskAdminNotes = (role == Role.CUSTOMER);
        return mapToResponse(repair, true, maskAdminNotes);
    }

    public PageResponse<RepairRequestResponse> getAllRepairsForAdmin(Pageable pageable) {
        Page<RepairRequestResponse> page = repairRequestRepository.findAll(pageable)
                .map(r -> mapToResponse(r, false, false));
        return PageResponse.from(page);
    }

    @Transactional
    public RepairRequestResponse reviewRepair(Long repairId, ReviewRequest request, Long adminId) {
        RepairRequest repair = repairRequestRepository.findById(repairId)
                .orElseThrow(() -> new ResourceNotFoundException("RepairRequest", "id", repairId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminId));

        String adminName = admin.getFirstName() + " " + admin.getLastName();

        if (request.approved()) {
            if (repair.getStatus() == RepairStatus.REQUESTED) {
                workflowService.recordTransition(repair, RepairStatus.UNDER_REVIEW, adminId, adminName, "Reviewed claim eligibility");
            }
            workflowService.recordTransition(repair, RepairStatus.APPROVED, adminId, adminName, "Approved: " + (request.coverageDecision() != null ? request.coverageDecision().name() : "Standard"));
            repair.setCoverageDecision(request.coverageDecision() != null ? request.coverageDecision() : CoverageDecision.COVERED_UNDER_WARRANTY);
            repair.setCoverageDecisionReason(request.coverageDecisionReason());
            repair.setAdminNotes(request.adminNotes());

            notificationService.createNotification(
                    repair.getCustomer(),
                    NotificationType.REPAIR_APPROVED,
                    "Service Claim Approved",
                    "Your repair " + repair.getReferenceNumber() + " has been authorized for technician assignment.",
                    repair.getId(),
                    "REPAIR_REQUEST"
            );
        } else {
            if (request.rejectionReason() == null || request.rejectionReason().isBlank()) {
                throw new BusinessRuleException("A rejection reason is mandatory when denying warranty repair coverage.");
            }
            if (repair.getStatus() == RepairStatus.REQUESTED) {
                workflowService.recordTransition(repair, RepairStatus.UNDER_REVIEW, adminId, adminName, "Evaluating claim");
            }
            repair.setCoverageDecision(CoverageDecision.DENIED);
            repair.setRejectionReason(request.rejectionReason());
            workflowService.recordTransition(repair, RepairStatus.REJECTED, adminId, adminName, "Rejected: " + request.rejectionReason());

            notificationService.createNotification(
                    repair.getCustomer(),
                    NotificationType.REPAIR_REJECTED,
                    "Service Claim Denied",
                    "Repair claim " + repair.getReferenceNumber() + " was not approved: " + request.rejectionReason(),
                    repair.getId(),
                    "REPAIR_REQUEST"
            );
        }

        return mapToResponse(repairRequestRepository.save(repair), true, false);
    }

    @Transactional
    public RepairRequestResponse assignTechnician(Long repairId, AssignTechnicianRequest request, Long adminId) {
        RepairRequest repair = repairRequestRepository.findById(repairId)
                .orElseThrow(() -> new ResourceNotFoundException("RepairRequest", "id", repairId));

        if (repair.getStatus() != RepairStatus.APPROVED) {
            throw new BusinessRuleException("Only APPROVED service requests can be assigned to a technician.");
        }

        User technician = userRepository.findById(request.technicianId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.technicianId()));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new BusinessRuleException("Selected user is not a certified technician.");
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminId));

        String adminName = admin.getFirstName() + " " + admin.getLastName();

        // Deactivate previous assignment if reassigning
        repairAssignmentRepository.findByRepairRequestAndActiveTrue(repair).ifPresent(prev -> {
            prev.setActive(false);
            prev.setCompletedAt(Instant.now());
            repairAssignmentRepository.save(prev);
        });

        // Transition status APPROVED -> ASSIGNED
        workflowService.recordTransition(
                repair,
                RepairStatus.ASSIGNED,
                adminId,
                adminName,
                "Assigned to technician " + technician.getFirstName() + " " + technician.getLastName()
        );

        // Record active assignment
        RepairAssignment assignment = RepairAssignment.builder()
                .repairRequest(repair)
                .technician(technician)
                .assignedBy(admin)
                .active(true)
                .assignmentNotes(request.notes())
                .build();
        repairAssignmentRepository.save(assignment);

        notificationService.createNotification(
                repair.getCustomer(),
                NotificationType.TECHNICIAN_ASSIGNED,
                "Technician Allocated",
                "Technician " + technician.getFirstName() + " " + technician.getLastName() + " is assigned to repair " + repair.getReferenceNumber(),
                repair.getId(),
                "REPAIR_REQUEST"
        );

        notificationService.createNotification(
                technician,
                NotificationType.TECHNICIAN_ASSIGNED,
                "New Bench Job Allocated",
                "Repair " + repair.getReferenceNumber() + " (" + repair.getCustomerProduct().getProduct().getName() + ") assigned to your workbench.",
                repair.getId(),
                "REPAIR_REQUEST"
        );

        return mapToResponse(repairRequestRepository.save(repair), true, false);
    }

    public PageResponse<RepairRequestResponse> getAssignedJobsForTechnician(Long technicianId, Pageable pageable) {
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", technicianId));

        Page<RepairRequestResponse> page = repairAssignmentRepository.findByTechnicianAndActiveTrue(technician, pageable)
                .map(a -> mapToResponse(a.getRepairRequest(), false, false));
        return PageResponse.from(page);
    }

    @Transactional
    public RepairRequestResponse updateTechnicianStatus(Long repairId, Long technicianId, TechnicianJobStatusUpdate update) {
        RepairRequest repair = verifyTechnicianAccess(repairId, technicianId);
        User tech = userRepository.findById(technicianId).orElseThrow();
        String techName = tech.getFirstName() + " " + tech.getLastName();

        workflowService.recordTransition(repair, update.newStatus(), technicianId, techName, update.comment());
        return mapToResponse(repairRequestRepository.save(repair), true, false);
    }

    @Transactional
    public RepairRequestResponse submitDiagnosis(Long repairId, Long technicianId, DiagnosisRequest request) {
        RepairRequest repair = verifyTechnicianAccess(repairId, technicianId);
        repair.setDiagnosisNotes(request.diagnosisNotes());
        return mapToResponse(repairRequestRepository.save(repair), true, false);
    }

    @Transactional
    public RepairRequestResponse completeRepair(Long repairId, Long technicianId, CompleteRepairRequest request) {
        RepairRequest repair = verifyTechnicianAccess(repairId, technicianId);
        User tech = userRepository.findById(technicianId).orElseThrow();
        String techName = tech.getFirstName() + " " + tech.getLastName();

        repair.setRepairActions(request.repairActions());
        repair.setCompletionNotes(request.completionNotes());
        repair.setTechnicianNotes(request.customerCareInstructions());
        repair.setCompletedAt(Instant.now());

        workflowService.recordTransition(repair, RepairStatus.COMPLETED, technicianId, techName, "Bench service completed and certified");

        notificationService.createNotification(
                repair.getCustomer(),
                NotificationType.REPAIR_COMPLETED,
                "Repair Completed & Certified",
                "Your product " + repair.getCustomerProduct().getProduct().getName() + " (Ticket: " + repair.getReferenceNumber() + ") is ready.",
                repair.getId(),
                "REPAIR_REQUEST"
        );

        return mapToResponse(repairRequestRepository.save(repair), true, false);
    }

    private RepairRequest verifyTechnicianAccess(Long repairId, Long technicianId) {
        RepairRequest repair = repairRequestRepository.findById(repairId)
                .orElseThrow(() -> new ResourceNotFoundException("RepairRequest", "id", repairId));

        Optional<RepairAssignment> assignment = repairAssignmentRepository.findByRepairRequestAndActiveTrue(repair);
        if (assignment.isEmpty() || !assignment.get().getTechnician().getId().equals(technicianId)) {
            throw new UnauthorizedAccessException("Technician is not allocated to this repair ticket.");
        }
        return repair;
    }

    private String generateReferenceNumber() {
        int year = Year.now().getValue();
        String prefix = "RV-" + year + "-";
        String maxRef = repairRequestRepository.findMaxReferenceNumberForYear(prefix);

        int nextSeq = 1;
        if (maxRef != null && maxRef.startsWith(prefix)) {
            try {
                String numStr = maxRef.substring(prefix.length());
                nextSeq = Integer.parseInt(numStr) + 1;
            } catch (NumberFormatException ignored) {}
        }
        return String.format("%s%05d", prefix, nextSeq);
    }

    private RepairRequestResponse mapToResponse(RepairRequest r, boolean includeHistory, boolean maskAdminNotes) {
        WarrantyResponse wResp = warrantyService.getWarrantyByCustomerProduct(r.getCustomerProduct());
        CustomerProductResponse cpResp = CustomerProductResponse.from(r.getCustomerProduct(), wResp);

        User c = r.getCustomer();
        UserProfileResponse customerResp = new UserProfileResponse(
                c.getId(), c.getFirstName(), c.getLastName(), c.getEmail(),
                c.getRole(), c.getPhone(), c.getAddress(), c.isEnabled(), c.getCreatedAt()
        );

        UserProfileResponse techResp = null;
        Optional<RepairAssignment> assignment = repairAssignmentRepository.findByRepairRequestAndActiveTrue(r);
        if (assignment.isPresent()) {
            User t = assignment.get().getTechnician();
            techResp = new UserProfileResponse(
                    t.getId(), t.getFirstName(), t.getLastName(), t.getEmail(),
                    t.getRole(), t.getPhone(), t.getAddress(), t.isEnabled(), t.getCreatedAt()
            );
        }

        List<RepairHistoryResponse> histList = null;
        if (includeHistory) {
            histList = repairHistoryRepository.findByRepairRequestOrderByCreatedAtAsc(r)
                    .stream()
                    .map(RepairHistoryResponse::from)
                    .toList();
        }

        return RepairRequestResponse.from(r, cpResp, customerResp, techResp, histList, maskAdminNotes);
    }
}
