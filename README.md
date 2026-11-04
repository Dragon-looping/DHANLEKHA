# DHANLEKHA (धनलेख)
### Premium 3D Personal Finance & Expense Intelligence Platform
> *"Every rupee has a story."*

---

## 01. Brand & Product Identity

**DHANLEKHA (धनलेख)** is an independent, sculptural financial intelligence platform crafted for salaried individuals. Designed with luxury minimalism and subtle Indian cultural roots, it departs entirely from generic fintech SaaS dashboards.

- **Dhan (धन):** Wealth, capital, sustenance.
- **Lekha (लेख):** Account, written record, ledger.
- **Visual Identity:** Cinematic luxury environment illuminated by warm golden light. Primary background (`#080807`), warm charcoal surfaces (`#191713`), dark bronze (`#282016`), brushed champagne gold (`#D6B77A`), warm amber (`#E5A94B`), soft ivory (`#F4EFE5`), and restrained emerald (`#00C99A`).
- **Signature Brand Symbol:** **The Wealth Orbit** — an original 3D sculptural geometry featuring two interlocking metallic structures (representing incoming and outgoing financial flows) centered around an equilibrium jewel (representing financial balance) illuminated over a reflective pedestal floor.
- **Autonomous Budget Sovereignty:** Fixed 50/30/20 constraints removed. Users possess total freedom to add, rename, and adjust custom categories, with real-time tracking of unallocated liquid buffers.

---

## 02. Architecture Overview

DHANLEKHA is architected as a clean two-tier application:

```
DHANLEKHA/
├── backend/                  # Java 21 Spring Boot Backend Service (Port 8080)
│   ├── pom.xml               # Maven configuration (Java 21, Spring Boot 3.3.4)
│   └── src/
│       ├── main/
│       │   ├── java/com/dhanlekha/
│       │   │   ├── DhanlekhaApplication.java
│       │   │   ├── model/         # OOP Domain Models (User, Transaction, Expense, Budget)
│       │   │   ├── interfaces/    # ExpenseOperations, BudgetOperations
│       │   │   ├── service/       # In-Memory Services (Auth, Expense, Budget, Analytics)
│       │   │   ├── controller/    # REST Endpoints (Auth, Budget, Expense, Analytics)
│       │   │   ├── config/        # SecurityConfig, CORS & Session Management
│       │   │   ├── dto/           # Request & Response Data Transfer Objects
│       │   │   └── exception/     # GlobalExceptionHandler & Custom ApiException
│       │   └── resources/
│       │       └── application.properties
│       └── test/
│           └── java/com/dhanlekha/
│               └── DhanlekhaIntegrationTest.java  # 13 Complete End-to-End Test Cases
│
├── frontend/                 # React + TypeScript + Three.js Frontend (Port 5173)
│   ├── package.json
│   ├── vite.config.ts        # Vite dev server with proxy to backend /api
│   ├── tailwind.config.js    # Custom luxury color palette & typography tokens
│   ├── index.html            # Google Fonts (Manrope, Inter, Noto Serif Devanagari, Cinzel)
│   └── src/
│       ├── types/            # TypeScript interfaces
│       ├── utils/            # formatINR, formatDate, CATEGORY_COLORS
│       ├── services/         # api, authService, budgetService, expenseService, analyticsService
│       ├── context/          # AuthContext (server-side session handling)
│       ├── components/
│       │   ├── branding/     # WealthOrbit (Three.js 3D), BrandWordmark
│       │   ├── layout/       # AppShell, Sidebar, Navbar
│       │   ├── dashboard/    # BalanceOverview, ExpensePieChart3D (Extruded Donut), CategoryBreakdown, RecentTransactions
│       │   └── expenses/     # ExpenseModal, DeleteConfirmModal
│       └── pages/
│           ├── LandingPage.tsx      # Cinematic 3D landing with portal zoom transition
│           ├── LoginPage.tsx        # Split screen authentication
│           ├── SignupPage.tsx       # Account creation with validation
│           ├── OnboardingPage.tsx   # Salary entry & 50/30/20 allocation
│           ├── DashboardPage.tsx    # Command centre with live 3D chart
│           ├── TransactionsPage.tsx # Chronological ledger with filters
│           ├── BudgetPage.tsx       # Needs / Wants / Savings breakdown & progress
│           └── InsightsPage.tsx     # Deep analytics & spending velocity
```

---

## 03. Academic OOP Syllabus Coverage (Java 21)

DHANLEKHA's backend is specifically engineered to demonstrate core Object-Oriented Programming (OOP) concepts in an understandable, viva-ready structure:

| Concept | Location in Codebase | Explanation / Viva Defense |
| :--- | :--- | :--- |
| **1. Classes & Objects** | `User.java`, `Expense.java`, `Budget.java` | Encapsulation of private state with getters/setters, default and parameterized constructors. |
| **2. Constructors & `this`** | `Transaction.java`, `Expense.java`, `User.java` | Explicit usage of `this.id`, `this.amount`, and constructor chaining (`this(...)`) to resolve ambiguity and prevent code duplication. |
| **3. Method Overloading** | `ExpenseService.java`, `ExpenseOperations.java` | Multiple versions of `addExpense`: (1) `addExpense(userId, title, amount)`, (2) `addExpense(userId, title, amount, category)`, and (3) `addExpense(userId, title, amount, category, date, description)`. |
| **4. Inheritance & `super`** | `Expense.java` extends `Transaction.java` | Subclass `Expense` inherits `id`, `amount`, `date`, `description` from abstract base class `Transaction` and explicitly invokes `super(userId, amount, date, description)`. |
| **5. Method Overriding & Polymorphism** | `Transaction.java` & `Expense.java` | Subclass overrides abstract methods `getTransactionType()` and `getTransactionSummary()`. `ExpenseService` and controllers iterate over `Transaction` references polymorphically. |
| **6. Abstract Classes & Interfaces** | `Transaction.java`, `ExpenseOperations.java`, `BudgetOperations.java` | `Transaction` enforces contract for financial transactions; `ExpenseOperations` and `BudgetOperations` decouple API controllers from implementation details. |
| **7. Packages & Access Modifiers** | `com.dhanlekha.*` (`model`, `service`, `controller`, `config`) | `protected` used in `Transaction` for subclass access; `private` for strict encapsulation; `public` for service contracts. |
| **8. `static` and `final`** | `Budget.java`, `ExpenseService.java` | `public static final double DEFAULT_NEEDS_PERCENT = 50.0;`, `public static final List<String> STANDARD_CATEGORIES`, immutable IDs with `private final String id;`, and static validation method `Budget.isValidAllocation(...)`. |

---

## 04. Strict In-Memory Architecture (Zero DB)

Per design requirements, DHANLEKHA does **not** write to MySQL, PostgreSQL, MongoDB, H2, SQLite, or browser local storage:
- Storage utilizes thread-safe Java Collections: `ConcurrentHashMap<String, User>`, `CopyOnWriteArrayList<Expense>`, and `ConcurrentHashMap<String, Budget>`.
- Identifiers are dynamically generated UUIDs (`UUID.randomUUID().toString()`).
- High-privacy ephemeral architecture: while the server runs, user sessions, budgets, and transactions persist seamlessly. If the backend restarts, all data resets cleanly.
- Authentication relies on Spring Security `BCryptPasswordEncoder` and server-side HTTP Sessions (`DHANLEKHA_SESSION` cookie).

---

## 05. REST API Documentation

All endpoints return structured JSON conforming to `ApiResponse<T>`:
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "timestamp": "2026-10-31T22:58:48.041"
}
```

### Authentication Endpoints
- `POST /api/auth/signup` — Register new user account.
- `POST /api/auth/login` — Authenticate and establish HTTP session.
- `POST /api/auth/logout` — Invalidate server-side session.
- `GET /api/auth/me` — Retrieve active session user profile.

### Budget Endpoints
- `POST /api/budget/salary` — Update monthly net salary (`{ "salary": 50000 }`).
- `GET /api/budget/summary` — Retrieve salary, total outflow, available balance, and 50/30/20 breakdown.
- `PUT /api/budget/allocation` — Update percentage targets (`{ "needsPercentage": 50, "wantsPercentage": 30, "savingsPercentage": 20 }`).

### Expense Endpoints
- `POST /api/expenses` — Record an expense (`{ "title": "...", "amount": 450, "category": "Food and Dining", "date": "2026-10-31", "description": "..." }`).
- `GET /api/expenses` — Query ledger entries with optional `search`, `category`, `startDate`, `endDate`, `sortBy`, `sortOrder`.
- `DELETE /api/expenses/{id}` — Remove an expense entry.

### Analytics Endpoints
- `GET /api/analytics/summary` — Computes velocity, average transaction, largest outflow, salary depletion rate.
- `GET /api/analytics/categories` — Real-time breakdown of expenditures by category for the 3D donut chart.

---

## 06. How to Run DHANLEKHA

### Prerequisites
- **Java 21** or higher (`java -version`)
- **Maven 3.8+** or higher (`mvn -version`)
- **Node.js 18+** or higher (`node -v`)

### Quick Start (One-Click Launcher)
In PowerShell at the project root:
```powershell
.\run-all.ps1
```
This automatically launches the Spring Boot backend, boots the Vite frontend, and opens [http://localhost:5173](http://localhost:5173) in your default browser.

---

### Manual Launch Commands

#### 1. Start the Java Spring Boot Backend
Open a terminal in the root directory:
```powershell
.\run-backend.ps1
# or manually:
cd backend
java -jar target/dhanlekha-backend-1.0.0.jar
```
The backend will boot on `http://localhost:8080`.

#### 2. Start the Frontend Application
Open a second terminal in the root directory:
```powershell
.\run-frontend.ps1
# or manually:
cd frontend
npm run dev
```
Open your browser at **`http://localhost:5173`**.

---

## 07. Automated Testing Suite

DHANLEKHA includes an automated integration test suite in `backend/src/test/java/com/dhanlekha/DhanlekhaIntegrationTest.java` verifying all 13 core requirements:
1. User registration
2. Duplicate email prevention
3. Password mismatch rejection
4. Valid login
5. Invalid password rejection
6. Salary onboarding (50/30/20 calculation)
7. Custom allocation updating
8. Multi-category expense entry
9. Real-time balance recalculation
10. Analytics calculation
11. Multi-user session isolation
12. Ledger deletion & recomputation
13. Session logout & invalidation

To execute the test suite:
```bash
cd backend
mvn test
```
**Test Results:** `Tests run: 13, Failures: 0, Errors: 0, Skipped: 0` (100% Passing).

---

## 08. Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Three.js, React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`), Framer Motion, Lucide React, React Router.
- **Backend:** Java 21, Spring Boot 3.3.4, Spring Web, Spring Security, BCrypt, Spring Validation, Jackson, Java Concurrent Collections.
- **Design Philosophy:** Luxury Minimalism, Cinematic 3D Transitions, Tabular Numerals, Indian Cultural Aesthetic.
