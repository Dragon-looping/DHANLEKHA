package com.dhanlekha.service;

import com.dhanlekha.interfaces.ExpenseOperations;
import com.dhanlekha.model.Expense;
import com.dhanlekha.model.Transaction;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * Service implementing expense management using In-Memory Collections.
 * Demonstrates OOP Syllabus:
 * 1. Interface implementation (implements ExpenseOperations)
 * 2. Method Overloading (addExpense variants)
 * 3. Polymorphism (Transaction reference handling subclass Expense objects)
 * 4. Java Collections (ConcurrentHashMap, CopyOnWriteArrayList)
 */
@Service
public class ExpenseService implements ExpenseOperations {

    // In-memory data structures: user id -> list of expenses
    private final Map<String, List<Expense>> userExpenses = new ConcurrentHashMap<>();

    // Standard pre-defined categories for DHANLEKHA
    public static final List<String> STANDARD_CATEGORIES = List.of(
            "Food and Dining",
            "Housing and Rent",
            "Transportation",
            "Shopping",
            "Entertainment",
            "Healthcare",
            "Education",
            "Other"
    );

    // Overloaded Method 1: Minimum parameters (title, amount)
    @Override
    public Expense addExpense(String userId, String title, BigDecimal amount) {
        return this.addExpense(userId, title, amount, "Other", LocalDate.now(), "");
    }

    // Overloaded Method 2: With category
    @Override
    public Expense addExpense(String userId, String title, BigDecimal amount, String category) {
        return this.addExpense(userId, title, amount, category, LocalDate.now(), "");
    }

    // Overloaded Method 3: Full parameter specification
    @Override
    public Expense addExpense(String userId, String title, BigDecimal amount, String category, LocalDate date, String description) {
        Expense expense = new Expense(userId, title, amount, category, date, description);

        userExpenses.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(0, expense);
        return expense;
    }

    @Override
    public boolean deleteExpense(String userId, String expenseId) {
        List<Expense> list = userExpenses.get(userId);
        if (list == null) return false;
        return list.removeIf(e -> e.getId().equals(expenseId));
    }

    @Override
    public List<Expense> getExpensesByUserId(String userId) {
        List<Expense> list = userExpenses.get(userId);
        if (list == null) return Collections.emptyList();
        return Collections.unmodifiableList(list);
    }

    @Override
    public BigDecimal getTotalExpenditure(String userId) {
        List<Expense> list = userExpenses.get(userId);
        if (list == null || list.isEmpty()) return BigDecimal.ZERO;

        BigDecimal total = BigDecimal.ZERO;
        // Demonstrating Polymorphism: Iterating over Transaction references
        for (Transaction tx : list) {
            total = total.add(tx.getAmount());
        }
        return total;
    }

    @Override
    public Map<String, BigDecimal> getCategoryTotals(String userId) {
        Map<String, BigDecimal> totals = new LinkedHashMap<>();
        for (String cat : STANDARD_CATEGORIES) {
            totals.put(cat, BigDecimal.ZERO);
        }

        List<Expense> list = userExpenses.get(userId);
        if (list != null) {
            for (Expense exp : list) {
                String cat = exp.getCategory();
                if (!totals.containsKey(cat)) {
                    cat = "Other";
                }
                totals.put(cat, totals.get(cat).add(exp.getAmount()));
            }
        }
        return totals;
    }

    public List<Expense> filterExpenses(String userId, String query, String category, LocalDate startDate, LocalDate endDate, String sortBy, String sortOrder) {
        List<Expense> list = userExpenses.get(userId);
        if (list == null || list.isEmpty()) return Collections.emptyList();

        return list.stream()
                .filter(e -> {
                    if (query != null && !query.isBlank()) {
                        String q = query.toLowerCase();
                        boolean matchTitle = e.getTitle().toLowerCase().contains(q);
                        boolean matchDesc = e.getDescription() != null && e.getDescription().toLowerCase().contains(q);
                        if (!matchTitle && !matchDesc) return false;
                    }
                    if (category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL")) {
                        if (!e.getCategory().equalsIgnoreCase(category)) return false;
                    }
                    if (startDate != null && e.getDate().isBefore(startDate)) return false;
                    if (endDate != null && e.getDate().isAfter(endDate)) return false;
                    return true;
                })
                .sorted((a, b) -> {
                    int result;
                    if ("amount".equalsIgnoreCase(sortBy)) {
                        result = a.getAmount().compareTo(b.getAmount());
                    } else {
                        // default: date
                        result = a.getDate().compareTo(b.getDate());
                    }
                    return "asc".equalsIgnoreCase(sortOrder) ? result : -result;
                })
                .collect(Collectors.toList());
    }
}
