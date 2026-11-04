package com.dhanlekha.dto;

import com.dhanlekha.model.User;
import java.math.BigDecimal;

public class UserResponse {
    private String id;
    private String name;
    private String email;
    private BigDecimal salary;

    public UserResponse() {}

    public UserResponse(String id, String name, String email, BigDecimal salary) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.salary = salary;
    }

    public static UserResponse fromUser(User user) {
        if (user == null) return null;
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getSalary()
        );
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }
}
