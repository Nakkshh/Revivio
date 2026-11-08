package com.revivio.notification;

import java.time.Instant;

public record NotificationResponse(
        Long id,
        NotificationType type,
        String title,
        String message,
        boolean read,
        Long referenceId,
        String referenceType,
        Instant createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getType(),
                n.getTitle(),
                n.getMessage(),
                n.isRead(),
                n.getReferenceId(),
                n.getReferenceType(),
                n.getCreatedAt()
        );
    }
}
