package com.dhanlekha.model;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Concrete Expense model representing an expenditure in DHANLEKHA.
 * Demonstrates OOP Syllabus:
 * 1. Inheritance (extends Transaction)
 * 2. 'super' keyword calling base class constructor
 * 3. Method Overriding (@Override)
 * 4. Runtime Polymorphism via Transaction reference
 */
public class Expense extends Transaction {

    private String title;
    private String category;

    public Expense() {
        super();
        this.title = "";
        this.category = "Other";
    }

    /**
     * Parameterized constructor invoking superclass constructor via 'super'.
     */
    public Expense(String userId, String title, BigDecimal amount, String category, LocalDate date, String description) {
        super(userId, amount, date, description);
        this.title = title != null ? title.trim() : "Untitled Expense";
        this.category = category != null && !category.isBlank() ? category.trim() : "Other";
    }

    /**
     * Overloaded constructor for quick expense entry with defaults.
     */
    public Expense(String userId, String title, BigDecimal amount, String category) {
        this(userId, title, amount, category, LocalDate.now(), "");
    }

    @Override
    public String getTransactionType() {
        return "EXPENSE";
    }

    @Override
    public String getTransactionSummary() {
        return String.format("[%s] %s: ₹%s (%s)", this.category, this.title, this.amount.toPlainString(), this.date);
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title != null ? title.trim() : "";
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category != null && !category.isBlank() ? category.trim() : "Other";
    }
}
