package com.revivio.product;

import com.revivio.brand.Brand;
import com.revivio.brand.BrandRepository;
import com.revivio.category.Category;
import com.revivio.category.CategoryRepository;
import com.revivio.common.PageResponse;
import com.revivio.exception.DuplicateResourceException;
import com.revivio.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    public PageResponse<ProductResponse> getAllActiveProducts(Pageable pageable) {
        Page<ProductResponse> page = productRepository.findByActiveTrue(pageable)
                .map(ProductResponse::from);
        return PageResponse.from(page);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return ProductResponse.from(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsByModelNumber(request.modelNumber())) {
            throw new DuplicateResourceException("Product with model " + request.modelNumber() + " already exists.");
        }

        Brand brand = brandRepository.findById(request.brandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", request.brandId()));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.categoryId()));

        Product product = Product.builder()
                .name(request.name().trim())
                .modelNumber(request.modelNumber().trim())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .brand(brand)
                .category(category)
                .active(true)
                .build();

        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        Brand brand = brandRepository.findById(request.brandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", request.brandId()));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.categoryId()));

        product.setName(request.name().trim());
        product.setModelNumber(request.modelNumber().trim());
        product.setDescription(request.description());
        product.setImageUrl(request.imageUrl());
        product.setBrand(brand);
        product.setCategory(category);

        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(false);
        productRepository.save(product);
    }
}
