package com.dhanlekha.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * User entity representing an authenticated account in DHANLEKHA.
 * Note: Contains passwordHash for verification, but passwordHash must NEVER
 * be serialized to API responses (sanitized DTOs or getters).
 */
public class User {

    private final String id;
    private String name;
    private String email;
    private String passwordHash;
    private BigDecimal salary;
    private final LocalDateTime createdAt;

    public User() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.salary = BigDecimal.ZERO;
    }

    public User(String name, String email, String passwordHash) {
        this.id = UUID.randomUUID().toString();
        this.name = name != null ? name.trim() : "";
        this.email = email != null ? email.trim().toLowerCase() : "";
        this.passwordHash = passwordHash;
        this.salary = BigDecimal.ZERO;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name != null ? name.trim() : "";
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email != null ? email.trim().toLowerCase() : "";
    }

    public String getPasswordHash() {
        return this.passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public BigDecimal getSalary() {
        return this.salary != null ? this.salary : BigDecimal.ZERO;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary != null ? salary : BigDecimal.ZERO;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }
}
