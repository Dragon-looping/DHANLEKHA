package com.dhanlekha.controller;

import com.dhanlekha.dto.ApiResponse;
import com.dhanlekha.dto.ExpenseRequest;
import com.dhanlekha.exception.ApiException;
import com.dhanlekha.model.Expense;
import com.dhanlekha.service.ExpenseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    private String getAuthenticatedUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("USER_ID") == null) {
            throw new ApiException("Authentication required. Please log in.", HttpStatus.UNAUTHORIZED);
        }
        return (String) session.getAttribute("USER_ID");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Expense>> createExpense(
            @Valid @RequestBody ExpenseRequest expenseRequest,
            HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        Expense created = expenseService.addExpense(
                userId,
                expenseRequest.getTitle(),
                expenseRequest.getAmount(),
                expenseRequest.getCategory(),
                expenseRequest.getDate() != null ? expenseRequest.getDate() : LocalDate.now(),
                expenseRequest.getDescription()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Expense recorded in DHANLEKHA ledger", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Expense>>> getExpenses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "date") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        List<Expense> expenses = expenseService.filterExpenses(userId, search, category, startDate, endDate, sortBy, sortOrder);
        return ResponseEntity.ok(ApiResponse.ok("Expenses retrieved successfully", expenses));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable String id, HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        boolean deleted = expenseService.deleteExpense(userId, id);
        if (!deleted) {
            throw new ApiException("Expense not found or could not be deleted", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(ApiResponse.ok("Expense entry deleted from ledger", null));
    }
}
