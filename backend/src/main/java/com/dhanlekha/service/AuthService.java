package com.dhanlekha.service;

import com.dhanlekha.dto.LoginRequest;
import com.dhanlekha.dto.SignupRequest;
import com.dhanlekha.dto.UserResponse;
import com.dhanlekha.exception.ApiException;
import com.dhanlekha.model.Budget;
import com.dhanlekha.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service managing user authentication and account lifecycle.
 * Uses in-memory concurrent hash maps for storage — strictly no persistent DB.
 */
@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final BudgetService budgetService;

    // In-memory collections (disappears when server restarts)
    private final Map<String, User> usersById = new ConcurrentHashMap<>();
    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();

    public AuthService(PasswordEncoder passwordEncoder, BudgetService budgetService) {
        this.passwordEncoder = passwordEncoder;
        this.budgetService = budgetService;
    }

    public UserResponse signup(SignupRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ApiException("Passwords do not match", HttpStatus.BAD_REQUEST);
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (usersByEmail.containsKey(normalizedEmail)) {
            throw new ApiException("An account with this email already exists", HttpStatus.CONFLICT);
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User newUser = new User(request.getName(), normalizedEmail, hashedPassword);

        usersById.put(newUser.getId(), newUser);
        usersByEmail.put(normalizedEmail, newUser);

        // Initialize default 50/30/20 budget for the user
        budgetService.initializeBudget(newUser.getId());

        return UserResponse.fromUser(newUser);
    }

    public UserResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = usersByEmail.get(normalizedEmail);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        return UserResponse.fromUser(user);
    }

    public User getUserById(String id) {
        if (id == null) return null;
        return usersById.get(id);
    }

    public UserResponse getUserResponseById(String id) {
        User user = getUserById(id);
        if (user == null) {
            throw new ApiException("User not found or session expired", HttpStatus.UNAUTHORIZED);
        }
        return UserResponse.fromUser(user);
    }

    public void updateUserSalary(String userId, java.math.BigDecimal salary) {
        User user = getUserById(userId);
        if (user != null) {
            user.setSalary(salary);
        }
    }
}
