package com.dhanlekha.service;

import com.dhanlekha.exception.ApiException;
import com.dhanlekha.interfaces.BudgetOperations;
import com.dhanlekha.model.Budget;
import com.dhanlekha.model.Expense;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service managing user Budget, salary allocations, and category classification.
 * Demonstrates OOP Syllabus:
 * 1. Interface implementation
 * 2. Static method invocation on Budget.isValidAllocation
 * 3. Monetary precision using BigDecimal
 */
@Service
public class BudgetService implements BudgetOperations {

    private final Map<String, Budget> userBudgets = new ConcurrentHashMap<>();
    private final ExpenseService expenseService;
    private AuthService authService;

    public BudgetService(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @org.springframework.beans.factory.annotation.Autowired
    public void setAuthService(@Lazy AuthService authService) {
        this.authService = authService;
    }

    public void initializeBudget(String userId) {
        userBudgets.putIfAbsent(userId, new Budget(userId));
    }

    @Override
    public Budget setSalary(String userId, BigDecimal salary) {
        if (salary == null || salary.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("Salary must be greater than zero", HttpStatus.BAD_REQUEST);
        }
        if (salary.compareTo(new BigDecimal("1000000000.00")) > 0) {
            throw new ApiException("Salary exceeds maximum allowed threshold of ₹1,00,00,00,000", HttpStatus.BAD_REQUEST);
        }
        BigDecimal normalizedSalary = salary.setScale(2, RoundingMode.HALF_UP);
        if (authService != null) {
            authService.updateUserSalary(userId, normalizedSalary);
        }
        Budget budget = userBudgets.computeIfAbsent(userId, Budget::new);
        return budget;
    }

    @Override
    public Budget updateAllocation(String userId, double needsPercent, double wantsPercent, double savingsPercent) {
        if (!Budget.isValidAllocation(needsPercent, wantsPercent, savingsPercent)) {
            throw new ApiException("Budget percentages must total exactly 100%", HttpStatus.BAD_REQUEST);
        }

        Budget budget = userBudgets.computeIfAbsent(userId, Budget::new);
        budget.setNeedsPercentage(needsPercent);
        budget.setWantsPercentage(wantsPercent);
        budget.setSavingsPercentage(savingsPercent);
        return budget;
    }

    @Override
    public Budget setCustomAllocations(String userId, Map<String, BigDecimal> allocations) {
        Budget budget = userBudgets.computeIfAbsent(userId, Budget::new);
        budget.setCustomAllocations(allocations);
        return budget;
    }

    @Override
    public Budget getBudgetByUserId(String userId) {
        return userBudgets.computeIfAbsent(userId, Budget::new);
    }

    @Override
    public Map<String, Object> getBudgetSummary(String userId) {
        Budget budget = getBudgetByUserId(userId);
        BigDecimal salary = BigDecimal.ZERO;
        if (authService != null && authService.getUserById(userId) != null) {
            salary = authService.getUserById(userId).getSalary();
        }

        BigDecimal totalExpenditure = expenseService.getTotalExpenditure(userId);
        BigDecimal availableBalance = salary.subtract(totalExpenditure);

        // Classify category spending into Needs vs Wants
        // Needs categories: Housing and Rent, Healthcare, Education, Transportation
        // Wants categories: Food and Dining, Shopping, Entertainment, Other
        List<Expense> expenses = expenseService.getExpensesByUserId(userId);
        BigDecimal actualNeedsSpent = BigDecimal.ZERO;
        BigDecimal actualWantsSpent = BigDecimal.ZERO;

        Set<String> needCategories = Set.of("Housing and Rent", "Healthcare", "Education", "Transportation");

        for (Expense exp : expenses) {
            if (needCategories.contains(exp.getCategory())) {
                actualNeedsSpent = actualNeedsSpent.add(exp.getAmount());
            } else {
                actualWantsSpent = actualWantsSpent.add(exp.getAmount());
            }
        }

        BigDecimal plannedNeeds = budget.calculateNeedsAllocation(salary);
        BigDecimal plannedWants = budget.calculateWantsAllocation(salary);
        BigDecimal plannedSavings = budget.calculateSavingsAllocation(salary);

        BigDecimal remainingNeeds = plannedNeeds.subtract(actualNeedsSpent);
        BigDecimal remainingWants = plannedWants.subtract(actualWantsSpent);
        BigDecimal actualRetainedSavings = availableBalance.max(BigDecimal.ZERO);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("salary", salary);
        summary.put("totalExpenditure", totalExpenditure);
        summary.put("availableBalance", availableBalance);
        summary.put("actualSavings", actualRetainedSavings);

        Map<String, Object> allocationInfo = new LinkedHashMap<>();
        allocationInfo.put("needsPercentage", budget.getNeedsPercentage());
        allocationInfo.put("wantsPercentage", budget.getWantsPercentage());
        allocationInfo.put("savingsPercentage", budget.getSavingsPercentage());
        summary.put("allocation", allocationInfo);

        Map<String, Object> needsMap = new LinkedHashMap<>();
        needsMap.put("planned", plannedNeeds);
        needsMap.put("spent", actualNeedsSpent);
        needsMap.put("remaining", remainingNeeds);
        needsMap.put("percentageUsed", calculatePercentage(actualNeedsSpent, plannedNeeds));
        summary.put("needs", needsMap);

        Map<String, Object> wantsMap = new LinkedHashMap<>();
        wantsMap.put("planned", plannedWants);
        wantsMap.put("spent", actualWantsSpent);
        wantsMap.put("remaining", remainingWants);
        wantsMap.put("percentageUsed", calculatePercentage(actualWantsSpent, plannedWants));
        summary.put("wants", wantsMap);

        Map<String, Object> savingsMap = new LinkedHashMap<>();
        savingsMap.put("planned", plannedSavings);
        savingsMap.put("actual", actualRetainedSavings);
        savingsMap.put("targetAchieved", plannedSavings.compareTo(BigDecimal.ZERO) > 0 && actualRetainedSavings.compareTo(plannedSavings) >= 0);
        summary.put("savings", savingsMap);

        // Custom Category Allocations
        Map<String, BigDecimal> customAllocations = budget.getCustomAllocations();
        BigDecimal totalAllocated = BigDecimal.ZERO;
        for (BigDecimal val : customAllocations.values()) {
            if (val != null) {
                totalAllocated = totalAllocated.add(val);
            }
        }
        BigDecimal unallocated = salary.subtract(totalAllocated).max(BigDecimal.ZERO);

        summary.put("customAllocations", customAllocations);
        summary.put("totalAllocated", totalAllocated);
        summary.put("unallocated", unallocated);

        // Category budgets breakdown with spending
        Map<String, BigDecimal> categoryTotals = expenseService.getCategoryTotals(userId);
        List<Map<String, Object>> categoryBudgets = new ArrayList<>();
        
        Set<String> allBudgetCats = new LinkedHashSet<>(customAllocations.keySet());
        for (String cat : ExpenseService.STANDARD_CATEGORIES) {
            allBudgetCats.add(cat);
        }

        for (String cat : allBudgetCats) {
            BigDecimal allocated = customAllocations.getOrDefault(cat, BigDecimal.ZERO);
            BigDecimal spent = categoryTotals.getOrDefault(cat, BigDecimal.ZERO);
            BigDecimal remaining = allocated.subtract(spent);

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("category", cat);
            item.put("allocated", allocated);
            item.put("spent", spent);
            item.put("remaining", remaining);
            item.put("percentageUsed", calculatePercentage(spent, allocated));
            categoryBudgets.add(item);
        }
        summary.put("categoryBudgets", categoryBudgets);

        return summary;
    }

    private double calculatePercentage(BigDecimal part, BigDecimal total) {
        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0 || part == null) {
            return 0.0;
        }
        return part.divide(total, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }
}
