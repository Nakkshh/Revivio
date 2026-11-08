package com.revivio.customerproduct;

import com.revivio.product.Product;
import com.revivio.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(
        name = "customer_products",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_customer_products_serial_number", columnNames = {"serial_number"})
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "serial_number", nullable = false, unique = true, length = 200)
    private String serialNumber;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "purchase_price", precision = 12, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;

    @Column(name = "invoice_verified", nullable = false)
    @Builder.Default
    private boolean invoiceVerified = false;

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
