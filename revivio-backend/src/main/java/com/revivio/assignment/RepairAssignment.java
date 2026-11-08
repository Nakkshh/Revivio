package com.revivio.assignment;

import com.revivio.repair.RepairRequest;
import com.revivio.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "repair_assignments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepairAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "repair_request_id", nullable = false)
    private RepairRequest repairRequest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "technician_id", nullable = false)
    private User technician;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_by_id", nullable = false)
    private User assignedBy;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "assignment_notes", columnDefinition = "TEXT")
    private String assignmentNotes;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private Instant assignedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @PrePersist
    protected void onCreate() {
        this.assignedAt = Instant.now();
    }
}
