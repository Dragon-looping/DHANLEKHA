package com.dhanlekha.interfaces;

import com.dhanlekha.model.Expense;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Interface defining contract for expense lifecycle management.
 * Demonstrates OOP Syllabus:
 * 1. Interface design & abstract contract
 * 2. Method overloading specification
 */
public interface ExpenseOperations {

    // Method Overloading demonstration
    Expense addExpense(String userId, String title, BigDecimal amount);
    Expense addExpense(String userId, String title, BigDecimal amount, String category);
    Expense addExpense(String userId, String title, BigDecimal amount, String category, LocalDate date, String description);

    boolean deleteExpense(String userId, String expenseId);

    List<Expense> getExpensesByUserId(String userId);

    BigDecimal getTotalExpenditure(String userId);

    Map<String, BigDecimal> getCategoryTotals(String userId);
}
