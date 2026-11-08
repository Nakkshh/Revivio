package com.revivio.user;

import com.revivio.auth.UserProfileResponse;
import com.revivio.common.ApiResponse;
import com.revivio.common.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<PageResponse<UserProfileResponse>>> getAllCustomers(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.getAllCustomers(pageable)));
    }

    @GetMapping("/technicians")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllTechnicians() {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.getAllTechnicians()));
    }

    @PostMapping("/technicians")
    public ResponseEntity<ApiResponse<UserProfileResponse>> createTechnician(@Valid @RequestBody CreateTechnicianRequest request) {
        UserProfileResponse response = adminUserService.createTechnician(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Technician account created successfully", response));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled
    ) {
        adminUserService.updateUserStatus(id, enabled);
        return ResponseEntity.ok(ApiResponse.success("User status updated", null));
    }
}
