package com.dhanlekha.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * DTO for setting or updating user monthly income/salary.
 * Supports any positive amount from 0.01 up to 1,000,000,000.00 (1 Billion INR)
 * with full decimal precision (e.g. 500, 49999, 50000, 50000.50, 75000, 100000).
 */
public class SalaryRequest {

    @NotNull(message = "Salary cannot be null or empty")
    @DecimalMin(value = "0.01", message = "Salary must be greater than zero")
    @DecimalMax(value = "1000000000.00", message = "Salary exceeds maximum allowed threshold of ₹1,00,00,00,000")
    private BigDecimal salary;

    public SalaryRequest() {}

    public SalaryRequest(BigDecimal salary) {
        this.salary = salary;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }
}
