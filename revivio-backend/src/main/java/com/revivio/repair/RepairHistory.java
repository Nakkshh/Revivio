package com.revivio.repair;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "repair_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepairHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "repair_request_id", nullable = false)
    private RepairRequest repairRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 20)
    private RepairStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 20)
    private RepairStatus newStatus;

    @Column(name = "actor_id", nullable = false)
    private Long actorId;

    @Column(name = "actor_name", nullable = false, length = 200)
    private String actorName;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
