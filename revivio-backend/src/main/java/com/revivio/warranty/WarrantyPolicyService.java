package com.revivio.warranty;

import com.revivio.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WarrantyPolicyService {

    private final WarrantyPolicyRepository warrantyPolicyRepository;

    public List<WarrantyPolicyResponse> getAllActivePolicies() {
        return warrantyPolicyRepository.findByActiveTrue()
                .stream()
                .map(WarrantyPolicyResponse::from)
                .toList();
    }

    public WarrantyPolicyResponse getPolicyById(Long id) {
        WarrantyPolicy policy = warrantyPolicyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WarrantyPolicy", "id", id));
        return WarrantyPolicyResponse.from(policy);
    }

    @Transactional
    public WarrantyPolicyResponse createPolicy(WarrantyPolicyRequest request) {
        WarrantyPolicy policy = WarrantyPolicy.builder()
                .name(request.name().trim())
                .description(request.description())
                .durationMonths(request.durationMonths())
                .coverageType(request.coverageType())
                .coversPhysicalDamage(request.coversPhysicalDamage())
                .coversWaterDamage(request.coversWaterDamage())
                .active(true)
                .build();
        return WarrantyPolicyResponse.from(warrantyPolicyRepository.save(policy));
    }

    @Transactional
    public WarrantyPolicyResponse updatePolicy(Long id, WarrantyPolicyRequest request) {
        WarrantyPolicy policy = warrantyPolicyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WarrantyPolicy", "id", id));

        policy.setName(request.name().trim());
        policy.setDescription(request.description());
        policy.setDurationMonths(request.durationMonths());
        policy.setCoverageType(request.coverageType());
        policy.setCoversPhysicalDamage(request.coversPhysicalDamage());
        policy.setCoversWaterDamage(request.coversWaterDamage());

        return WarrantyPolicyResponse.from(warrantyPolicyRepository.save(policy));
    }

    @Transactional
    public void deletePolicy(Long id) {
        WarrantyPolicy policy = warrantyPolicyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WarrantyPolicy", "id", id));
        policy.setActive(false);
        warrantyPolicyRepository.save(policy);
    }
}
