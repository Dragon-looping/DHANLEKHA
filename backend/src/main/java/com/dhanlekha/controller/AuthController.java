package com.dhanlekha.controller;

import com.dhanlekha.dto.ApiResponse;
import com.dhanlekha.dto.LoginRequest;
import com.dhanlekha.dto.SignupRequest;
import com.dhanlekha.dto.UserResponse;
import com.dhanlekha.exception.ApiException;
import com.dhanlekha.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserResponse>> signup(@Valid @RequestBody SignupRequest request, HttpServletRequest httpRequest) {
        UserResponse response = authService.signup(request);
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("USER_ID", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful. Welcome to DHANLEKHA.", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        UserResponse response = authService.login(request);
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("USER_ID", response.getId());
        return ResponseEntity.ok(ApiResponse.ok("Login successful.", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully.", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("USER_ID") == null) {
            throw new ApiException("No active session found", HttpStatus.UNAUTHORIZED);
        }
        String userId = (String) session.getAttribute("USER_ID");
        UserResponse response = authService.getUserResponseById(userId);
        return ResponseEntity.ok(ApiResponse.ok("Current user details retrieved", response));
    }
}
