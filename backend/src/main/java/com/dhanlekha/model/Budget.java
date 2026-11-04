package com.dhanlekha.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Budget model managing income allocation following the customizable 50/30/20 guideline.
 * Demonstrates OOP Syllabus:
 * 1. 'static' and 'final' fields for constant definitions
 * 2. Static methods for budget validation
 * 3. Encapsulation and precision monetary calculations with BigDecimal
 */
public class Budget {

    // static final constants for default budgeting guidelines
    public static final double DEFAULT_NEEDS_PERCENT = 50.0;
    public static final double DEFAULT_WANTS_PERCENT = 30.0;
    public static final double DEFAULT_SAVINGS_PERCENT = 20.0;
    public static final double TOTAL_PERCENT_TARGET = 100.0;

    private String userId;
    private double needsPercentage;
    private double wantsPercentage;
    private double savingsPercentage;
    private java.util.Map<String, BigDecimal> customAllocations = new java.util.concurrent.ConcurrentHashMap<>();

    public Budget() {
        this.needsPercentage = DEFAULT_NEEDS_PERCENT;
        this.wantsPercentage = DEFAULT_WANTS_PERCENT;
        this.savingsPercentage = DEFAULT_SAVINGS_PERCENT;
    }

    public Budget(String userId) {
        this();
        this.userId = userId;
    }

    public Budget(String userId, double needsPercentage, double wantsPercentage, double savingsPercentage) {
        this.userId = userId;
        this.needsPercentage = needsPercentage;
        this.wantsPercentage = wantsPercentage;
        this.savingsPercentage = savingsPercentage;
    }

    /**
     * Validates if percentage allocations add up to 100%.
     */
    public static boolean isValidAllocation(double needs, double wants, double savings) {
        double total = needs + wants + savings;
        return Math.abs(total - TOTAL_PERCENT_TARGET) < 0.001;
    }

    // Allocation calculation methods
    public BigDecimal calculateNeedsAllocation(BigDecimal salary) {
        if (salary == null || salary.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;
        return salary.multiply(BigDecimal.valueOf(needsPercentage))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateWantsAllocation(BigDecimal salary) {
        if (salary == null || salary.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;
        return salary.multiply(BigDecimal.valueOf(wantsPercentage))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateSavingsAllocation(BigDecimal salary) {
        if (salary == null || salary.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;
        return salary.multiply(BigDecimal.valueOf(savingsPercentage))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public double getNeedsPercentage() {
        return this.needsPercentage;
    }

    public void setNeedsPercentage(double needsPercentage) {
        this.needsPercentage = needsPercentage;
    }

    public double getWantsPercentage() {
        return this.wantsPercentage;
    }

    public void setWantsPercentage(double wantsPercentage) {
        this.wantsPercentage = wantsPercentage;
    }

    public double getSavingsPercentage() {
        return this.savingsPercentage;
    }

    public void setSavingsPercentage(double savingsPercentage) {
        this.savingsPercentage = savingsPercentage;
    }

    public java.util.Map<String, BigDecimal> getCustomAllocations() {
        return this.customAllocations;
    }

    public void setCustomAllocations(java.util.Map<String, BigDecimal> customAllocations) {
        this.customAllocations = customAllocations != null ? new java.util.concurrent.ConcurrentHashMap<>(customAllocations) : new java.util.concurrent.ConcurrentHashMap<>();
    }
}
