package com.revivio.customerproduct;

import com.revivio.brand.Brand;
import com.revivio.category.Category;
import com.revivio.exception.DuplicateResourceException;
import com.revivio.exception.ResourceNotFoundException;
import com.revivio.exception.UnauthorizedAccessException;
import com.revivio.product.Product;
import com.revivio.product.ProductRepository;
import com.revivio.user.Role;
import com.revivio.user.User;
import com.revivio.user.UserRepository;
import com.revivio.warranty.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerProductServiceTest {

    @Mock
    private CustomerProductRepository customerProductRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private WarrantyPolicyRepository warrantyPolicyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WarrantyService warrantyService;

    @InjectMocks
    private CustomerProductService customerProductService;

    private User customer;
    private User otherCustomer;
    private Brand brand;
    private Category category;
    private Product product;
    private WarrantyPolicy policy;

    @BeforeEach
    void setUp() {
        customer = User.builder()
                .id(1L)
                .email("alex@example.com")
                .firstName("Alex")
                .lastName("Morgan")
                .role(Role.CUSTOMER)
                .build();

        otherCustomer = User.builder()
                .id(2L)
                .email("sarah@example.com")
                .firstName("Sarah")
                .lastName("Connor")
                .role(Role.CUSTOMER)
                .build();

        brand = Brand.builder().id(10L).name("Apple").build();
        category = Category.builder().id(20L).name("Laptops").build();

        product = Product.builder()
                .id(100L)
                .brand(brand)
                .category(category)
                .modelNumber("MBP-M3-16")
                .name("MacBook Pro 16\" M3 Max")
                .build();

        policy = WarrantyPolicy.builder()
                .id(50L)
                .name("Standard Consumer 12M")
                .durationMonths(12)
                .coverageType(CoverageType.STANDARD)
                .build();
    }

    @Test
    @DisplayName("Should successfully register product and issue active warranty")
    void testRegisterProductSuccess() {
        CustomerProductRequest request = new CustomerProductRequest(
                100L,
                "C02G1234MD6R",
                LocalDate.of(2025, 2, 1),
                new BigDecimal("2499.00"),
                "Purchased at Flagship Store",
                50L
        );

        when(customerProductRepository.existsBySerialNumber("C02G1234MD6R")).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));
        when(warrantyPolicyRepository.findById(50L)).thenReturn(Optional.of(policy));

        when(customerProductRepository.save(any(CustomerProduct.class))).thenAnswer(invocation -> {
            CustomerProduct cp = invocation.getArgument(0);
            cp.setId(500L);
            cp.setCreatedAt(Instant.now());
            return cp;
        });

        Warranty warranty = Warranty.builder()
                .id(800L)
                .warrantyPolicy(policy)
                .startDate(LocalDate.of(2025, 2, 1))
                .endDate(LocalDate.of(2026, 2, 1))
                .status(WarrantyStatus.ACTIVE)
                .build();

        when(warrantyService.createWarrantyForProduct(any(CustomerProduct.class), eq(policy)))
                .thenReturn(warranty);

        CustomerProductResponse response = customerProductService.registerProduct(request, 1L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(500L);
        assertThat(response.serialNumber()).isEqualTo("C02G1234MD6R");
        assertThat(response.product().name()).isEqualTo("MacBook Pro 16\" M3 Max");
        assertThat(response.warranty()).isNotNull();
        assertThat(response.warranty().status()).isEqualTo(WarrantyStatus.ACTIVE);

        verify(customerProductRepository, times(1)).save(any(CustomerProduct.class));
        verify(warrantyService, times(1)).createWarrantyForProduct(any(CustomerProduct.class), eq(policy));
    }

    @Test
    @DisplayName("Should reject product registration if serial number already exists")
    void testRegisterProductDuplicateSerial() {
        CustomerProductRequest request = new CustomerProductRequest(
                100L,
                "EXISTING-SERIAL-99",
                LocalDate.of(2025, 2, 1),
                new BigDecimal("1200.00"),
                null,
                50L
        );

        when(customerProductRepository.existsBySerialNumber("EXISTING-SERIAL-99")).thenReturn(true);

        assertThatThrownBy(() -> customerProductService.registerProduct(request, 1L))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("EXISTING-SERIAL-99 is already registered");

        verify(customerProductRepository, never()).save(any(CustomerProduct.class));
        verify(warrantyService, never()).createWarrantyForProduct(any(), any());
    }

    @Test
    @DisplayName("Should reject product registration if product model does not exist in catalog")
    void testRegisterProductNotFound() {
        CustomerProductRequest request = new CustomerProductRequest(
                999L,
                "SERIAL-12345",
                LocalDate.of(2025, 2, 1),
                null,
                null,
                50L
        );

        when(customerProductRepository.existsBySerialNumber("SERIAL-12345")).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customerProductService.registerProduct(request, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Product not found");

        verify(customerProductRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully return product details for verified owner")
    void testGetMyProductByIdSuccess() {
        CustomerProduct cp = CustomerProduct.builder()
                .id(500L)
                .customer(customer)
                .product(product)
                .serialNumber("C02G1234MD6R")
                .purchaseDate(LocalDate.of(2025, 2, 1))
                .invoiceVerified(true)
                .createdAt(Instant.now())
                .build();

        WarrantyResponse wResp = new WarrantyResponse(
                800L, LocalDate.of(2025, 2, 1), LocalDate.of(2026, 2, 1),
                WarrantyStatus.ACTIVE, "Standard Consumer 12M", 12, CoverageType.STANDARD, null
        );

        when(customerProductRepository.findById(500L)).thenReturn(Optional.of(cp));
        when(warrantyService.getWarrantyByCustomerProduct(cp)).thenReturn(wResp);

        CustomerProductResponse response = customerProductService.getMyProductById(500L, 1L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(500L);
        assertThat(response.serialNumber()).isEqualTo("C02G1234MD6R");
        assertThat(response.warranty().status()).isEqualTo(WarrantyStatus.ACTIVE);
    }

    @Test
    @DisplayName("Should deny access when requesting product owned by another user")
    void testGetMyProductByIdUnauthorized() {
        CustomerProduct cp = CustomerProduct.builder()
                .id(500L)
                .customer(customer) // owned by customer (id 1)
                .product(product)
                .serialNumber("C02G1234MD6R")
                .build();

        when(customerProductRepository.findById(500L)).thenReturn(Optional.of(cp));

        // otherCustomer (id 2) tries to inspect customer 1's device
        assertThatThrownBy(() -> customerProductService.getMyProductById(500L, 2L))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessageContaining("You do not have permission to view this registered product");

        verify(warrantyService, never()).getWarrantyByCustomerProduct(any());
    }
}
