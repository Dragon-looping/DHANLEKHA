package com.dhanlekha.interfaces;

import com.dhanlekha.model.Budget;
import java.math.BigDecimal;
import java.util.Map;

/**
 * Interface defining contract for salary & budget allocation operations.
 * Demonstrates OOP Syllabus:
 * 1. Interface contracts
 * 2. Polymorphic service implementation
 */
public interface BudgetOperations {

    Budget setSalary(String userId, BigDecimal salary);

    Budget updateAllocation(String userId, double needsPercent, double wantsPercent, double savingsPercent);

    Budget setCustomAllocations(String userId, Map<String, BigDecimal> allocations);

    Budget getBudgetByUserId(String userId);

    Map<String, Object> getBudgetSummary(String userId);
}
