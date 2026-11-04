package com.dhanlekha.controller;

import com.dhanlekha.dto.ApiResponse;
import com.dhanlekha.exception.ApiException;
import com.dhanlekha.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    private String getAuthenticatedUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("USER_ID") == null) {
            throw new ApiException("Authentication required. Please log in.", HttpStatus.UNAUTHORIZED);
        }
        return (String) session.getAttribute("USER_ID");
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalyticsSummary(HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        Map<String, Object> summary = analyticsService.getAnalyticsSummary(userId);
        return ResponseEntity.ok(ApiResponse.ok("Financial analytics summary generated", summary));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCategoryBreakdown(HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        List<Map<String, Object>> breakdown = analyticsService.getCategoryBreakdown(userId);
        return ResponseEntity.ok(ApiResponse.ok("Category expenditure breakdown generated", breakdown));
    }
}
