package com.revivio.warranty;

import com.revivio.customerproduct.CustomerProduct;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "warranties")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Warranty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_product_id", nullable = false, unique = true)
    private CustomerProduct customerProduct;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "warranty_policy_id", nullable = false)
    private WarrantyPolicy warrantyPolicy;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private WarrantyStatus status;

    @Column(name = "void_reason", columnDefinition = "TEXT")
    private String voidReason;

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
