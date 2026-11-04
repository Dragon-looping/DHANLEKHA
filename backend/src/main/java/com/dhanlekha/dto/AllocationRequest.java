package com.dhanlekha.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class AllocationRequest {

    @NotNull(message = "Needs percentage is required")
    @DecimalMin(value = "0.0", message = "Percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Percentage cannot exceed 100")
    private Double needsPercentage;

    @NotNull(message = "Wants percentage is required")
    @DecimalMin(value = "0.0", message = "Percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Percentage cannot exceed 100")
    private Double wantsPercentage;

    @NotNull(message = "Savings percentage is required")
    @DecimalMin(value = "0.0", message = "Percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Percentage cannot exceed 100")
    private Double savingsPercentage;

    public Double getNeedsPercentage() {
        return needsPercentage;
    }

    public void setNeedsPercentage(Double needsPercentage) {
        this.needsPercentage = needsPercentage;
    }

    public Double getWantsPercentage() {
        return wantsPercentage;
    }

    public void setWantsPercentage(Double wantsPercentage) {
        this.wantsPercentage = wantsPercentage;
    }

    public Double getSavingsPercentage() {
        return savingsPercentage;
    }

    public void setSavingsPercentage(Double savingsPercentage) {
        this.savingsPercentage = savingsPercentage;
    }
}
