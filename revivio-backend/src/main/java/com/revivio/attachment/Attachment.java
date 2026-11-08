package com.revivio.attachment;

import com.revivio.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_filename", nullable = false, length = 300)
    private String originalFilename;

    @Column(name = "stored_filename", nullable = false, unique = true, length = 300)
    private String storedFilename;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Column(name = "file_size", nullable = false)
    private long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    private AttachmentCategory category;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "uploaded_by_id", nullable = false)
    private User uploadedBy;

    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
