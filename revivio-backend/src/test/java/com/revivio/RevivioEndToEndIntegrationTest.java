package com.revivio;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.revivio.auth.LoginRequest;
import com.revivio.auth.RegisterRequest;
import com.revivio.brand.Brand;
import com.revivio.brand.BrandRepository;
import com.revivio.category.Category;
import com.revivio.category.CategoryRepository;
import com.revivio.customerproduct.CustomerProduct;
import com.revivio.customerproduct.CustomerProductRepository;
import com.revivio.customerproduct.CustomerProductRequest;
import com.revivio.product.Product;
import com.revivio.product.ProductRepository;
import com.revivio.repair.*;
import com.revivio.user.Role;
import com.revivio.user.User;
import com.revivio.user.UserRepository;
import com.revivio.warranty.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class RevivioEndToEndIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarrantyPolicyRepository warrantyPolicyRepository;

    @Autowired
    private CustomerProductRepository customerProductRepository;

    @Autowired
    private RepairRequestRepository repairRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User adminUser;
    private User techUser;
    private Brand testBrand;
    private Category testCategory;
    private Product testProduct;
    private WarrantyPolicy standardPolicy;

    @BeforeEach
    void setUpDatabase() {
        repairRequestRepository.deleteAll();
        customerProductRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        brandRepository.deleteAll();
        warrantyPolicyRepository.deleteAll();
        userRepository.deleteAll();

        // Seed Admin User
        adminUser = userRepository.save(User.builder()
                .email("admin@revivio.test")
                .password(passwordEncoder.encode("AdminPass123!"))
                .firstName("Eleanor")
                .lastName("Vance")
                .role(Role.ADMIN)
                .enabled(true)
                .build());

        // Seed Technician User
        techUser = userRepository.save(User.builder()
                .email("tech@revivio.test")
                .password(passwordEncoder.encode("TechPass123!"))
                .firstName("Marcus")
                .lastName("Cole")
                .role(Role.TECHNICIAN)
                .enabled(true)
                .build());

        // Seed Brand & Category
        testBrand = brandRepository.save(Brand.builder()
                .name("Apple")
                .description("Hardware Manufacturer")
                .active(true)
                .build());

        testCategory = categoryRepository.save(Category.builder()
                .name("Laptops")
                .description("Portable Computing")
                .active(true)
                .build());

        // Seed Product Model
        testProduct = productRepository.save(Product.builder()
                .brand(testBrand)
                .category(testCategory)
                .name("MacBook Pro 16")
                .modelNumber("MBP-M3-16")
                .description("16-inch Liquid Retina XDR")
                .active(true)
                .build());

        // Seed Warranty Policy
        standardPolicy = warrantyPolicyRepository.save(WarrantyPolicy.builder()
                .name("Standard Consumer 12M")
                .durationMonths(12)
                .coverageType(CoverageType.STANDARD)
                .description("12-month standard hardware defect coverage")
                .active(true)
                .build());
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest loginReq = new LoginRequest(email, password);
        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        return root.path("data").path("token").asText();
    }

    @Test
    @DisplayName("Verify Seed Data Authentication Credentials")
    void testSeedPasswords() {
        assertThat(passwordEncoder.matches("admin123", "$2a$10$ZuXOT7XCfXDLwUMugAQZyOGJILsFsyWwunt4XZFMyvlcR1JetevcC")).isTrue();
        assertThat(passwordEncoder.matches("tech123", "$2a$10$As2ffzuAcfcvkeR5Ib7lB.Gg6Tb83YJgOPPSZA92c6G8AsKfx4NUi")).isTrue();
        assertThat(passwordEncoder.matches("cust123", "$2a$10$m0DpeQSesPVzUb9OwHkKYeArRuofy/9ZL6STKN8QavDVo1jHj55RK")).isTrue();
    }

    @Test
    @DisplayName("Complete End-to-End Workflow: Auth, Product Registration, Claims Lifecycle, Triage, and Dispatch")
    void testFullCustomerTechnicianAdminWorkflow() throws Exception {
        // =========================================================================
        // 1. CUSTOMER REGISTRATION & LOGIN
        // =========================================================================
        RegisterRequest registerReq = new RegisterRequest(
                "Sarah",
                "Connor",
                "sarah.connor@test.com",
                "Cyberdyne123!",
                "+1 555-0199"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("sarah.connor@test.com"))
                .andExpect(jsonPath("$.data.token").isNotEmpty());

        String customerToken = loginAndGetToken("sarah.connor@test.com", "Cyberdyne123!");
        assertThat(customerToken).isNotEmpty();

        // Security check: Customer CANNOT access admin customers directory
        mockMvc.perform(get("/admin/customers")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // =========================================================================
        // 2. PRODUCT REGISTRATION & WARRANTY GENERATION
        // =========================================================================
        CustomerProductRequest productReq = new CustomerProductRequest(
                testProduct.getId(),
                "SN-REV-2026-9999",
                LocalDate.now().minusMonths(2),
                new BigDecimal("2499.00"),
                "Purchased at authorized retail store",
                standardPolicy.getId()
        );

        MvcResult prodResult = mockMvc.perform(post("/customer-products/register")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.serialNumber").value("SN-REV-2026-9999"))
                .andExpect(jsonPath("$.data.warranty.status").value("ACTIVE"))
                .andReturn();

        JsonNode prodJson = objectMapper.readTree(prodResult.getResponse().getContentAsString());
        long customerProductId = prodJson.path("data").path("id").asLong();

        // Business Rule: Duplicate serial registration MUST fail
        mockMvc.perform(post("/customer-products/register")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productReq)))
                .andExpect(status().isConflict());

        // =========================================================================
        // 3. SERVICE CLAIM LODGING
        // =========================================================================
        RepairRequestCreate repairReq = new RepairRequestCreate(
                customerProductId,
                IssueCategory.HARDWARE,
                "Logic board power delivery intermittent",
                "Device fails to charge past 40% and shuts down unexpectedly after 20 minutes.",
                Priority.HIGH,
                "Requires expedited inspection"
        );

        MvcResult repairResult = mockMvc.perform(post("/repairs")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(repairReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.referenceNumber").value(org.hamcrest.Matchers.startsWith("RV-")))
                .andExpect(jsonPath("$.data.status").value("REQUESTED"))
                .andExpect(jsonPath("$.data.adminNotes").isEmpty()) // Confidential notes masked for customer
                .andReturn();

        JsonNode repairJson = objectMapper.readTree(repairResult.getResponse().getContentAsString());
        long repairId = repairJson.path("data").path("id").asLong();

        // Business Rule: Concurrent open repair tickets for same serial MUST be blocked
        mockMvc.perform(post("/repairs")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(repairReq)))
                .andExpect(status().isBadRequest());

        // =========================================================================
        // 4. ADMIN CLAIM ADJUDICATION (REVIEW & APPROVE)
        // =========================================================================
        String adminToken = loginAndGetToken("admin@revivio.test", "AdminPass123!");

        ReviewRequest reviewApprove = new ReviewRequest(
                true,
                CoverageDecision.COVERED_UNDER_WARRANTY,
                "Device is within 12M manufacturer warranty duration",
                null,
                "Internal: Verified clean diagnostic telemetry"
        );

        mockMvc.perform(patch("/admin/repairs/" + repairId + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewApprove)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("APPROVED"))
                .andExpect(jsonPath("$.data.coverageDecision").value("COVERED_UNDER_WARRANTY"))
                .andExpect(jsonPath("$.data.adminNotes").value("Internal: Verified clean diagnostic telemetry"));

        // =========================================================================
        // 5. ADMIN TECHNICIAN ASSIGNMENT
        // =========================================================================
        AssignTechnicianRequest assignReq = new AssignTechnicianRequest(
                techUser.getId(),
                "Priority bench job - check power management IC"
        );

        mockMvc.perform(post("/admin/repairs/" + repairId + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(assignReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("ASSIGNED"))
                .andExpect(jsonPath("$.data.assignedTechnician.email").value("tech@revivio.test"));

        // =========================================================================
        // 6. TECHNICIAN WORKBENCH (BENCH DIAGNOSIS & REPAIR)
        // =========================================================================
        String techToken = loginAndGetToken("tech@revivio.test", "TechPass123!");

        // Transition: ASSIGNED -> IN_REPAIR
        TechnicianJobStatusUpdate statusUpdate = new TechnicianJobStatusUpdate(
                RepairStatus.IN_REPAIR,
                "Disassembled chassis, hooked multimeter to logic board rails"
        );

        mockMvc.perform(patch("/technician/jobs/" + repairId + "/status")
                        .header("Authorization", "Bearer " + techToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("IN_REPAIR"));

        // Record diagnostic findings
        DiagnosisRequest diagReq = new DiagnosisRequest("Faulty PMIC mosfet detected on charging circuit");
        mockMvc.perform(post("/technician/jobs/" + repairId + "/diagnosis")
                        .header("Authorization", "Bearer " + techToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(diagReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.diagnosisNotes").value("Faulty PMIC mosfet detected on charging circuit"));

        // Finalize & complete repair
        CompleteRepairRequest completeReq = new CompleteRepairRequest(
                "Replaced OEM PMIC controller and recalibrated battery BMS",
                "Device successfully charged to 100% and stress-tested under load for 2 hours",
                "Use only certified 140W USB-C power adapters"
        );

        mockMvc.perform(post("/technician/jobs/" + repairId + "/complete")
                        .header("Authorization", "Bearer " + techToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(completeReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));

        // =========================================================================
        // 7. VERIFY CUSTOMER NOTIFICATIONS & AUDIT TIMELINE
        // =========================================================================
        mockMvc.perform(get("/notifications")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content[0]").exists());

        // Final customer inspection of completed ticket
        mockMvc.perform(get("/repairs/" + repairId)
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"))
                .andExpect(jsonPath("$.data.adminNotes").isEmpty()); // Confidential admin notes strictly masked
    }
}
