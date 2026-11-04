package com.dhanlekha.service;

import com.dhanlekha.model.Expense;
import com.dhanlekha.model.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class AnalyticsService {

    private final ExpenseService expenseService;
    private final AuthService authService;

    public AnalyticsService(ExpenseService expenseService, AuthService authService) {
        this.expenseService = expenseService;
        this.authService = authService;
    }

    public Map<String, Object> getAnalyticsSummary(String userId) {
        User user = authService.getUserById(userId);
        BigDecimal salary = user != null ? user.getSalary() : BigDecimal.ZERO;
        List<Expense> expenses = expenseService.getExpensesByUserId(userId);
        BigDecimal totalSpent = expenseService.getTotalExpenditure(userId);

        Map<String, Object> summary = new LinkedHashMap<>();
        int totalTransactions = expenses.size();
        summary.put("totalTransactions", totalTransactions);
        summary.put("totalSpent", totalSpent);
        summary.put("salary", salary);

        BigDecimal balance = salary.subtract(totalSpent);
        summary.put("balance", balance);

        // Average transaction amount
        BigDecimal avgTransaction = BigDecimal.ZERO;
        if (totalTransactions > 0) {
            avgTransaction = totalSpent.divide(BigDecimal.valueOf(totalTransactions), 2, RoundingMode.HALF_UP);
        }
        summary.put("averageTransaction", avgTransaction);

        // Largest expense
        Expense largest = null;
        for (Expense e : expenses) {
            if (largest == null || e.getAmount().compareTo(largest.getAmount()) > 0) {
                largest = e;
            }
        }
        summary.put("largestExpense", largest);

        // Percentage of salary spent
        double salarySpentPercentage = 0.0;
        if (salary.compareTo(BigDecimal.ZERO) > 0) {
            salarySpentPercentage = totalSpent.divide(salary, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }
        summary.put("salarySpentPercentage", salarySpentPercentage);

        // Savings percentage
        double savingsRate = 0.0;
        if (salary.compareTo(BigDecimal.ZERO) > 0 && balance.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = balance.divide(salary, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }
        summary.put("savingsRate", savingsRate);

        // Highest spending category
        Map<String, BigDecimal> catTotals = expenseService.getCategoryTotals(userId);
        String highestCategory = "None";
        BigDecimal highestCatAmount = BigDecimal.ZERO;
        for (Map.Entry<String, BigDecimal> entry : catTotals.entrySet()) {
            if (entry.getValue().compareTo(highestCatAmount) > 0) {
                highestCatAmount = entry.getValue();
                highestCategory = entry.getKey();
            }
        }
        summary.put("highestCategory", highestCategory);
        summary.put("highestCategoryAmount", highestCatAmount);

        return summary;
    }

    public List<Map<String, Object>> getCategoryBreakdown(String userId) {
        BigDecimal totalSpent = expenseService.getTotalExpenditure(userId);
        Map<String, BigDecimal> catTotals = expenseService.getCategoryTotals(userId);
        List<Expense> expenses = expenseService.getExpensesByUserId(userId);

        Map<String, Integer> categoryCounts = new HashMap<>();
        for (Expense e : expenses) {
            categoryCounts.put(e.getCategory(), categoryCounts.getOrDefault(e.getCategory(), 0) + 1);
        }

        List<Map<String, Object>> breakdown = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : catTotals.entrySet()) {
            String cat = entry.getKey();
            BigDecimal amount = entry.getValue();

            double percentage = 0.0;
            if (totalSpent.compareTo(BigDecimal.ZERO) > 0) {
                percentage = amount.divide(totalSpent, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            }

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("category", cat);
            item.put("amount", amount);
            item.put("percentage", percentage);
            item.put("count", categoryCounts.getOrDefault(cat, 0));
            breakdown.add(item);
        }

        return breakdown;
    }
}
