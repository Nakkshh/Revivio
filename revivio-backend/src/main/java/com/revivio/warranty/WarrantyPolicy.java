package com.revivio.warranty;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "warranty_policies")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_months", nullable = false)
    private int durationMonths;

    @Enumerated(EnumType.STRING)
    @Column(name = "coverage_type", nullable = false, length = 20)
    private CoverageType coverageType;

    @Column(name = "covers_physical_damage", nullable = false)
    @Builder.Default
    private boolean coversPhysicalDamage = false;

    @Column(name = "covers_water_damage", nullable = false)
    @Builder.Default
    private boolean coversWaterDamage = false;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;

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
