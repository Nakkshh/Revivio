package com.revivio.notification;

import com.revivio.common.ApiResponse;
import com.revivio.common.PageResponse;
import com.revivio.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<NotificationResponse>>> getMyNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getNotificationsForUser(userDetails.getUserId(), pageable)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUnreadCount(userDetails.getUserId())));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        notificationService.markAsRead(id, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.markAllAsRead(userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}
