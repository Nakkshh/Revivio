package com.revivio.brand;

import com.revivio.exception.DuplicateResourceException;
import com.revivio.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrandService {

    private final BrandRepository brandRepository;

    public List<BrandResponse> getAllActiveBrands() {
        return brandRepository.findByActiveTrue()
                .stream()
                .map(BrandResponse::from)
                .toList();
    }

    public BrandResponse getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", id));
        return BrandResponse.from(brand);
    }

    @Transactional
    public BrandResponse createBrand(BrandRequest request) {
        if (brandRepository.existsByName(request.name())) {
            throw new DuplicateResourceException("Brand with name " + request.name() + " already exists.");
        }
        Brand brand = Brand.builder()
                .name(request.name().trim())
                .description(request.description())
                .logoUrl(request.logoUrl())
                .active(true)
                .build();
        return BrandResponse.from(brandRepository.save(brand));
    }

    @Transactional
    public BrandResponse updateBrand(Long id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", id));

        brand.setName(request.name().trim());
        brand.setDescription(request.description());
        brand.setLogoUrl(request.logoUrl());
        return BrandResponse.from(brandRepository.save(brand));
    }

    @Transactional
    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", id));
        brand.setActive(false);
        brandRepository.save(brand);
    }
}
