package com.revivio.user;

import com.revivio.auth.UserProfileResponse;
import com.revivio.common.PageResponse;
import com.revivio.exception.DuplicateResourceException;
import com.revivio.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PageResponse<UserProfileResponse> getAllCustomers(Pageable pageable) {
        Page<UserProfileResponse> page = userRepository.findByRole(Role.CUSTOMER, pageable)
                .map(u -> new UserProfileResponse(
                        u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(),
                        u.getRole(), u.getPhone(), u.getAddress(), u.isEnabled(), u.getCreatedAt()
                ));
        return PageResponse.from(page);
    }

    public List<UserProfileResponse> getAllTechnicians() {
        return userRepository.findByRole(Role.TECHNICIAN)
                .stream()
                .map(u -> new UserProfileResponse(
                        u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(),
                        u.getRole(), u.getPhone(), u.getAddress(), u.isEnabled(), u.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public UserProfileResponse createTechnician(CreateTechnicianRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("User with email " + request.email() + " already exists.");
        }

        User tech = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email().toLowerCase().trim())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.TECHNICIAN)
                .phone(request.phone())
                .enabled(true)
                .build();

        User saved = userRepository.save(tech);
        return new UserProfileResponse(
                saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getEmail(),
                saved.getRole(), saved.getPhone(), saved.getAddress(), saved.isEnabled(), saved.getCreatedAt()
        );
    }

    @Transactional
    public void updateUserStatus(Long id, boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setEnabled(enabled);
        userRepository.save(user);
    }
}
