package com.dhanlekha.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Abstract base class representing a generic financial movement in DHANLEKHA.
 * Demonstrates OOP Syllabus:
 * 1. Abstract classes and methods
 * 2. Constructors and 'this' keyword
 * 3. Encapsulation with protected & private access modifiers
 * 4. Foundation for inheritance and polymorphism
 */
public abstract class Transaction {

    protected final String id;
    protected String userId;
    protected BigDecimal amount;
    protected LocalDate date;
    protected String description;

    /**
     * Default constructor generating a unique identifier.
     */
    public Transaction() {
        this.id = UUID.randomUUID().toString();
        this.date = LocalDate.now();
        this.amount = BigDecimal.ZERO;
    }

    /**
     * Parameterized constructor using 'this' keyword to initialize fields.
     */
    public Transaction(String userId, BigDecimal amount, LocalDate date, String description) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.amount = amount != null ? amount : BigDecimal.ZERO;
        this.date = date != null ? date : LocalDate.now();
        this.description = description != null ? description.trim() : "";
    }

    // Abstract methods demonstrating Polymorphism - subclasses must implement these
    public abstract String getTransactionType();
    public abstract String getTransactionSummary();

    // Getters and Setters
    public String getId() {
        return this.id;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount != null ? amount : BigDecimal.ZERO;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
