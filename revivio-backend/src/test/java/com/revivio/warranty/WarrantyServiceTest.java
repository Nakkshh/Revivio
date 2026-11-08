package com.revivio.warranty;

import com.revivio.customerproduct.CustomerProduct;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WarrantyServiceTest {

    @Mock
    private WarrantyRepository warrantyRepository;

    @InjectMocks
    private WarrantyService warrantyService;

    private WarrantyPolicy standard12mPolicy;
    private WarrantyPolicy premium24mPolicy;
    private CustomerProduct customerProduct;

    @BeforeEach
    void setUp() {
        standard12mPolicy = WarrantyPolicy.builder()
                .id(1L)
                .name("Standard Consumer 12M")
                .durationMonths(12)
                .coverageType(CoverageType.STANDARD)
                .build();

        premium24mPolicy = WarrantyPolicy.builder()
                .id(2L)
                .name("Revivio Care+ 24M")
                .durationMonths(24)
                .coverageType(CoverageType.PREMIUM)
                .build();

        customerProduct = CustomerProduct.builder()
                .id(10L)
                .serialNumber("TEST-SER-001")
                .purchaseDate(LocalDate.now().minusMonths(2))
                .invoiceVerified(true)
                .build();
    }

    @Test
    @DisplayName("Should accurately calculate 12-month warranty expiration date")
    void test12MonthWarrantyDateCalculation() {
        when(warrantyRepository.save(any(Warranty.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Warranty warranty = warrantyService.createWarrantyForProduct(customerProduct, standard12mPolicy);

        LocalDate expectedStart = LocalDate.now().minusMonths(2);
        assertThat(warranty.getStartDate()).isEqualTo(expectedStart);
        assertThat(warranty.getEndDate()).isEqualTo(expectedStart.plusMonths(12));
        assertThat(warranty.getStatus()).isEqualTo(WarrantyStatus.ACTIVE);
    }

    @Test
    @DisplayName("Should accurately calculate 24-month warranty expiration date")
    void test24MonthWarrantyDateCalculation() {
        when(warrantyRepository.save(any(Warranty.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Warranty warranty = warrantyService.createWarrantyForProduct(customerProduct, premium24mPolicy);

        LocalDate expectedStart = LocalDate.now().minusMonths(2);
        assertThat(warranty.getStartDate()).isEqualTo(expectedStart);
        assertThat(warranty.getEndDate()).isEqualTo(expectedStart.plusMonths(24));
    }

    @Test
    @DisplayName("Should mark warranty as EXPIRED when purchase date plus duration is in the past")
    void testExpiredWarrantyCreation() {
        CustomerProduct oldProduct = CustomerProduct.builder()
                .id(11L)
                .serialNumber("OLD-SER-999")
                .purchaseDate(LocalDate.now().minusMonths(25))
                .invoiceVerified(true)
                .build();

        when(warrantyRepository.save(any(Warranty.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Warranty warranty = warrantyService.createWarrantyForProduct(oldProduct, standard12mPolicy);

        assertThat(warranty.getStatus()).isEqualTo(WarrantyStatus.EXPIRED);
    }

    @Test
    @DisplayName("Should set status to PENDING_VERIFICATION if invoice is not yet verified")
    void testPendingVerificationWarranty() {
        CustomerProduct unverifiedProduct = CustomerProduct.builder()
                .id(12L)
                .serialNumber("UNVER-001")
                .purchaseDate(LocalDate.now().minusDays(5))
                .invoiceVerified(false)
                .build();

        when(warrantyRepository.save(any(Warranty.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Warranty warranty = warrantyService.createWarrantyForProduct(unverifiedProduct, standard12mPolicy);

        assertThat(warranty.getStatus()).isEqualTo(WarrantyStatus.PENDING_VERIFICATION);
    }

    @Test
    @DisplayName("Should recalculate status to EXPIRED on fetch if endDate is before today (Inclusive boundary)")
    void testDynamicStatusRecalculationOnGet() {
        Warranty pastWarranty = Warranty.builder()
                .id(50L)
                .customerProduct(customerProduct)
                .warrantyPolicy(standard12mPolicy)
                .startDate(LocalDate.now().minusMonths(14))
                .endDate(LocalDate.now().minusMonths(2))
                .status(WarrantyStatus.ACTIVE) // Outdated state
                .build();

        when(warrantyRepository.findByCustomerProduct(customerProduct)).thenReturn(Optional.of(pastWarranty));

        WarrantyResponse response = warrantyService.getWarrantyByCustomerProduct(customerProduct);

        assertThat(response.status()).isEqualTo(WarrantyStatus.EXPIRED);
        verify(warrantyRepository).save(pastWarranty);
    }
}
