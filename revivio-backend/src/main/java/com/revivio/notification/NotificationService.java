package com.revivio.notification;

import com.revivio.common.PageResponse;
import com.revivio.exception.ResourceNotFoundException;
import com.revivio.exception.UnauthorizedAccessException;
import com.revivio.user.User;
import com.revivio.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createNotification(User user, NotificationType type, String title, String message, Long refId, String refType) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .read(false)
                .referenceId(refId)
                .referenceType(refType)
                .build();
        notificationRepository.save(notification);
    }

    public PageResponse<NotificationResponse> getNotificationsForUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Page<NotificationResponse> page = notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(NotificationResponse::from);
        return PageResponse.from(page);
    }

    public long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return notificationRepository.countByUserAndReadFalse(user);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You cannot modify another user's notifications.");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        notificationRepository.findByUserAndReadFalse(user).forEach(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
