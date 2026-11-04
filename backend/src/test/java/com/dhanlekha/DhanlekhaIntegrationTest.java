package com.dhanlekha;

import com.dhanlekha.dto.AllocationRequest;
import com.dhanlekha.dto.ExpenseRequest;
import com.dhanlekha.dto.LoginRequest;
import com.dhanlekha.dto.SalaryRequest;
import com.dhanlekha.dto.SignupRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = DhanlekhaApplication.class)
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class DhanlekhaIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static MockHttpSession user1Session = new MockHttpSession();
    private static MockHttpSession user2Session = new MockHttpSession();

    @Test
    @Order(1)
    @DisplayName("1. User Signup - Normal Registration")
    void testUser1Signup() throws Exception {
        SignupRequest request = new SignupRequest();
        request.setName("Ishaan Sharma");
        request.setEmail("ishaan@dhanlekha.in");
        request.setPassword("SecurePass123");
        request.setConfirmPassword("SecurePass123");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .session(user1Session))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Ishaan Sharma"))
                .andExpect(jsonPath("$.data.email").value("ishaan@dhanlekha.in"));
    }

    @Test
    @Order(2)
    @DisplayName("2. Duplicate Email Registration Validation")
    void testDuplicateEmail() throws Exception {
        SignupRequest duplicate = new SignupRequest();
        duplicate.setName("Ishaan Imposter");
        duplicate.setEmail("ishaan@dhanlekha.in");
        duplicate.setPassword("DifferentPassword");
        duplicate.setConfirmPassword("DifferentPassword");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(3)
    @DisplayName("3. Password Mismatch Validation")
    void testPasswordMismatch() throws Exception {
        SignupRequest mismatch = new SignupRequest();
        mismatch.setName("Mismatch User");
        mismatch.setEmail("mismatch@dhanlekha.in");
        mismatch.setPassword("PassOne123");
        mismatch.setConfirmPassword("PassTwo999");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mismatch)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(4)
    @DisplayName("4. User Login - Valid Credentials")
    void testUser1Login() throws Exception {
        LoginRequest login = new LoginRequest();
        login.setEmail("ishaan@dhanlekha.in");
        login.setPassword("SecurePass123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login))
                .session(user1Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("ishaan@dhanlekha.in"));
    }

    @Test
    @Order(5)
    @DisplayName("5. User Login - Invalid Credentials")
    void testInvalidLogin() throws Exception {
        LoginRequest badLogin = new LoginRequest();
        badLogin.setEmail("ishaan@dhanlekha.in");
        badLogin.setPassword("WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(badLogin)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(6)
    @DisplayName("6. Financial Onboarding - Set Monthly Salary")
    void testSetSalary() throws Exception {
        // Test multiple valid salary values including 50000, 49999, 50001, and decimals
        BigDecimal[] validSalaries = {
            new BigDecimal("500"),
            new BigDecimal("1000"),
            new BigDecimal("15000"),
            new BigDecimal("25000"),
            new BigDecimal("49999"),
            new BigDecimal("50000"),
            new BigDecimal("50001"),
            new BigDecimal("75000"),
            new BigDecimal("100000"),
            new BigDecimal("150000"),
            new BigDecimal("50000.50")
        };

        for (BigDecimal s : validSalaries) {
            SalaryRequest req = new SalaryRequest(s);
            mockMvc.perform(post("/api/budget/salary")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(req))
                    .session(user1Session))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }

        // Finalize with 50000.00
        SalaryRequest salaryRequest = new SalaryRequest();
        salaryRequest.setSalary(BigDecimal.valueOf(50000.00));

        mockMvc.perform(post("/api/budget/salary")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(salaryRequest))
                .session(user1Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.salary").value(50000.00))
                .andExpect(jsonPath("$.data.needs.planned").value(25000.00))
                .andExpect(jsonPath("$.data.wants.planned").value(15000.00))
                .andExpect(jsonPath("$.data.savings.planned").value(10000.00));
    }

    @Test
    @Order(7)
    @DisplayName("7. Budget Allocation - Update Custom Percentages (Total 100%)")
    void testUpdateBudgetCustomAllocation() throws Exception {
        AllocationRequest alloc = new AllocationRequest();
        alloc.setNeedsPercentage(45.0);
        alloc.setWantsPercentage(25.0);
        alloc.setSavingsPercentage(30.0);

        mockMvc.perform(put("/api/budget/allocation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(alloc))
                .session(user1Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.needsPercentage").value(45.0))
                .andExpect(jsonPath("$.data.wantsPercentage").value(25.0))
                .andExpect(jsonPath("$.data.savingsPercentage").value(30.0));
    }

    @Test
    @Order(8)
    @DisplayName("8. Record Expenses - Add Multiple Categorized Expenses")
    void testAddExpenses() throws Exception {
        // Expense 1: Food and Dining
        ExpenseRequest exp1 = new ExpenseRequest();
        exp1.setTitle("Dinner with Clients");
        exp1.setAmount(BigDecimal.valueOf(2500.00));
        exp1.setCategory("Food and Dining");
        exp1.setDate(LocalDate.now());
        exp1.setDescription("Culinary meeting at Taj Lands End");

        mockMvc.perform(post("/api/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(exp1))
                .session(user1Session))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.title").value("Dinner with Clients"))
                .andExpect(jsonPath("$.data.amount").value(2500.00))
                .andExpect(jsonPath("$.data.category").value("Food and Dining"));

        // Expense 2: Housing and Rent
        ExpenseRequest exp2 = new ExpenseRequest();
        exp2.setTitle("Apartment Maintenance");
        exp2.setAmount(BigDecimal.valueOf(4500.00));
        exp2.setCategory("Housing and Rent");
        exp2.setDate(LocalDate.now());

        mockMvc.perform(post("/api/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(exp2))
                .session(user1Session))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.amount").value(4500.00));
    }

    @Test
    @Order(9)
    @DisplayName("9. Budget Summary Verification - Calculated Available & Outflow")
    void testBudgetSummaryAfterExpenses() throws Exception {
        mockMvc.perform(get("/api/budget/summary")
                .session(user1Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalExpenditure").value(7000.00))
                .andExpect(jsonPath("$.data.availableBalance").value(43000.00));
    }

    @Test
    @Order(10)
    @DisplayName("10. Analytics Verification - Category Breakdown & Metrics")
    void testAnalyticsSummary() throws Exception {
        mockMvc.perform(get("/api/analytics/summary")
                .session(user1Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalTransactions").value(2))
                .andExpect(jsonPath("$.data.totalSpent").value(7000.00))
                .andExpect(jsonPath("$.data.highestCategory").value("Housing and Rent"));

        mockMvc.perform(get("/api/analytics/categories")
                .session(user1Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[?(@.category == 'Housing and Rent')].amount").value(4500.00))
                .andExpect(jsonPath("$.data[?(@.category == 'Food and Dining')].amount").value(2500.00));
    }

    @Test
    @Order(11)
    @DisplayName("11. Session Isolation - Verify User 2 Cannot See User 1 Data")
    void testSessionIsolation() throws Exception {
        // Register User 2
        SignupRequest user2 = new SignupRequest();
        user2.setName("Priya Nair");
        user2.setEmail("priya@dhanlekha.in");
        user2.setPassword("SecretPass456");
        user2.setConfirmPassword("SecretPass456");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user2))
                .session(user2Session))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Priya Nair"));

        // User 2 expenses should be empty initially (0 transactions)
        mockMvc.perform(get("/api/expenses")
                .session(user2Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());

        // User 2 budget summary total expenditure should be 0
        mockMvc.perform(get("/api/budget/summary")
                .session(user2Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalExpenditure").value(0));
    }

    @Test
    @Order(12)
    @DisplayName("12. Delete Expense - Delete Entry and Verify Recalculation")
    void testDeleteExpense() throws Exception {
        // Get User 1 expenses to find an ID
        MvcResult result = mockMvc.perform(get("/api/expenses")
                .session(user1Session))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(content);
        String expenseId = root.get("data").get(0).get("id").asText();

        // Delete the expense
        mockMvc.perform(delete("/api/expenses/" + expenseId)
                .session(user1Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // After deleting 1 of the 2 expenses, total transactions should be 1
        mockMvc.perform(get("/api/analytics/summary")
                .session(user1Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalTransactions").value(1));
    }

    @Test
    @Order(13)
    @DisplayName("13. User Logout - Session Invalidation")
    void testLogout() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                .session(user1Session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Subsequent authenticated call should fail
        mockMvc.perform(get("/api/auth/me")
                .session(user1Session))
                .andExpect(status().isUnauthorized());
    }
}
