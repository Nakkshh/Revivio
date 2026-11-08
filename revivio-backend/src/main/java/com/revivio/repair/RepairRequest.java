package com.revivio.repair;

import com.revivio.customerproduct.CustomerProduct;
import com.revivio.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "repair_requests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepairRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_number", nullable = false, unique = true, length = 20)
    private String referenceNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_product_id", nullable = false)
    private CustomerProduct customerProduct;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_category", nullable = false, length = 30)
    private IssueCategory issueCategory;

    @Column(name = "issue_title", nullable = false, length = 300)
    private String issueTitle;

    @Column(name = "issue_description", nullable = false, columnDefinition = "TEXT")
    private String issueDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 10)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private RepairStatus status = RepairStatus.REQUESTED;

    @Enumerated(EnumType.STRING)
    @Column(name = "coverage_decision", length = 30)
    private CoverageDecision coverageDecision;

    @Column(name = "coverage_decision_reason", columnDefinition = "TEXT")
    private String coverageDecisionReason;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "technician_notes", columnDefinition = "TEXT")
    private String technicianNotes;

    @Column(name = "diagnosis_notes", columnDefinition = "TEXT")
    private String diagnosisNotes;

    @Column(name = "repair_actions", columnDefinition = "TEXT")
    private String repairActions;

    @Column(name = "completion_notes", columnDefinition = "TEXT")
    private String completionNotes;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
