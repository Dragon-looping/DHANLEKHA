package com.dhanlekha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * DHANLEKHA (धनलेख) - Personal Finance and Expense Intelligence Platform
 * Entry point of the Spring Boot application.
 * All application state is preserved purely in backend memory using Java Collections.
 */
@SpringBootApplication
public class DhanlekhaApplication {

    public static void main(String[] args) {
        SpringApplication.run(DhanlekhaApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  DHANLEKHA (धनलेख) Backend Service Active        ");
        System.out.println("  Status: In-Memory Ledger Online                 ");
        System.out.println("  Port: 8080                                      ");
        System.out.println("  Brand Philosophy: 'Every rupee has a story.'    ");
        System.out.println("==================================================");
    }
}
