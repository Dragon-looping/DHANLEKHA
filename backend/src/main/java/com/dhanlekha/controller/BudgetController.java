package com.dhanlekha.controller;

import com.dhanlekha.dto.AllocationRequest;
import com.dhanlekha.dto.ApiResponse;
import com.dhanlekha.dto.SalaryRequest;
import com.dhanlekha.exception.ApiException;
import com.dhanlekha.model.Budget;
import com.dhanlekha.service.BudgetService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    private String getAuthenticatedUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("USER_ID") == null) {
            throw new ApiException("Authentication required. Please log in.", HttpStatus.UNAUTHORIZED);
        }
        return (String) session.getAttribute("USER_ID");
    }

    @PostMapping("/salary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> setSalary(
            @Valid @RequestBody SalaryRequest salaryRequest,
            HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        budgetService.setSalary(userId, salaryRequest.getSalary());
        Map<String, Object> summary = budgetService.getBudgetSummary(userId);
        return ResponseEntity.ok(ApiResponse.ok("Monthly salary updated successfully", summary));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBudgetSummary(HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        Map<String, Object> summary = budgetService.getBudgetSummary(userId);
        return ResponseEntity.ok(ApiResponse.ok("Budget summary retrieved", summary));
    }

    @PutMapping("/allocation")
    public ResponseEntity<ApiResponse<Budget>> updateAllocation(
            @Valid @RequestBody AllocationRequest allocationRequest,
            HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        Budget budget = budgetService.updateAllocation(
                userId,
                allocationRequest.getNeedsPercentage(),
                allocationRequest.getWantsPercentage(),
                allocationRequest.getSavingsPercentage()
        );
        return ResponseEntity.ok(ApiResponse.ok("Budget allocation guideline updated", budget));
    }

    @PutMapping("/custom-allocations")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateCustomAllocations(
            @RequestBody Map<String, java.math.BigDecimal> allocations,
            HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        budgetService.setCustomAllocations(userId, allocations);
        Map<String, Object> summary = budgetService.getBudgetSummary(userId);
        return ResponseEntity.ok(ApiResponse.ok("Custom category allocations updated", summary));
    }
}
