export interface User {
  id: string;
  name: string;
  email: string;
  salary: number;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  transactionType?: string;
}

export interface Allocation {
  needsPercentage: number;
  wantsPercentage: number;
  savingsPercentage: number;
}

export interface BudgetSummary {
  salary: number;
  totalExpenditure: number;
  availableBalance: number;
  actualSavings: number;
  allocation: Allocation;
  needs: {
    planned: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
  };
  wants: {
    planned: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
  };
  savings: {
    planned: number;
    actual: number;
    targetAchieved: boolean;
  };
  customAllocations?: Record<string, number>;
  totalAllocated?: number;
  unallocated?: number;
  categoryBudgets?: Array<{
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
  }>;
}

export interface AnalyticsSummary {
  totalTransactions: number;
  totalSpent: number;
  salary: number;
  balance: number;
  averageTransaction: number;
  largestExpense: Expense | null;
  salarySpentPercentage: number;
  savingsRate: number;
  highestCategory: string;
  highestCategoryAmount: number;
}

export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
