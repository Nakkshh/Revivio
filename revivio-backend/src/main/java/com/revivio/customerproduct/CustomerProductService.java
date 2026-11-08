package com.revivio.customerproduct;

import com.revivio.common.PageResponse;
import com.revivio.exception.DuplicateResourceException;
import com.revivio.exception.ResourceNotFoundException;
import com.revivio.exception.UnauthorizedAccessException;
import com.revivio.product.Product;
import com.revivio.product.ProductRepository;
import com.revivio.user.User;
import com.revivio.user.UserRepository;
import com.revivio.warranty.Warranty;
import com.revivio.warranty.WarrantyPolicy;
import com.revivio.warranty.WarrantyPolicyRepository;
import com.revivio.warranty.WarrantyResponse;
import com.revivio.warranty.WarrantyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerProductService {

    private final CustomerProductRepository customerProductRepository;
    private final ProductRepository productRepository;
    private final WarrantyPolicyRepository warrantyPolicyRepository;
    private final UserRepository userRepository;
    private final WarrantyService warrantyService;

    @Transactional
    public CustomerProductResponse registerProduct(CustomerProductRequest request, Long customerId) {
        if (customerProductRepository.existsBySerialNumber(request.serialNumber().trim())) {
            throw new DuplicateResourceException("Device with serial number " + request.serialNumber() + " is already registered.");
        }

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.productId()));

        WarrantyPolicy policy = warrantyPolicyRepository.findById(request.warrantyPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("WarrantyPolicy", "id", request.warrantyPolicyId()));

        CustomerProduct customerProduct = CustomerProduct.builder()
                .customer(customer)
                .product(product)
                .serialNumber(request.serialNumber().trim())
                .purchaseDate(request.purchaseDate())
                .purchasePrice(request.purchasePrice())
                .additionalNotes(request.additionalNotes())
                .invoiceVerified(true) // Automatically verify for dev/demo registration
                .build();

        CustomerProduct saved = customerProductRepository.save(customerProduct);

        Warranty warranty = warrantyService.createWarrantyForProduct(saved, policy);
        WarrantyResponse warrantyResponse = WarrantyResponse.from(warranty);

        return CustomerProductResponse.from(saved, warrantyResponse);
    }

    public PageResponse<CustomerProductResponse> getMyProducts(Long customerId, Pageable pageable) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        Page<CustomerProductResponse> page = customerProductRepository.findByCustomer(customer, pageable)
                .map(cp -> {
                    WarrantyResponse wResp = warrantyService.getWarrantyByCustomerProduct(cp);
                    return CustomerProductResponse.from(cp, wResp);
                });

        return PageResponse.from(page);
    }

    public CustomerProductResponse getMyProductById(Long id, Long customerId) {
        CustomerProduct cp = customerProductRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerProduct", "id", id));

        if (!cp.getCustomer().getId().equals(customerId)) {
            throw new UnauthorizedAccessException("You do not have permission to view this registered product.");
        }

        WarrantyResponse wResp = warrantyService.getWarrantyByCustomerProduct(cp);
        return CustomerProductResponse.from(cp, wResp);
    }
}
