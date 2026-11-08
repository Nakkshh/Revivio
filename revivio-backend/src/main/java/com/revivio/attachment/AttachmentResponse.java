package com.revivio.attachment;

import java.time.Instant;

public record AttachmentResponse(
        Long id,
        String originalFilename,
        String contentType,
        long fileSize,
        AttachmentCategory category,
        Long referenceId,
        String referenceType,
        String downloadUrl,
        Instant createdAt
) {
    public static AttachmentResponse from(Attachment a, String downloadUrl) {
        return new AttachmentResponse(
                a.getId(),
                a.getOriginalFilename(),
                a.getContentType(),
                a.getFileSize(),
                a.getCategory(),
                a.getReferenceId(),
                a.getReferenceType(),
                downloadUrl,
                a.getCreatedAt()
        );
    }
}
