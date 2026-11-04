import { request } from './api';
import { BudgetSummary, Allocation } from '../types';

export const budgetService = {
  async setSalary(salary: number): Promise<BudgetSummary> {
    return request<BudgetSummary>('/budget/salary', {
      method: 'POST',
      body: JSON.stringify({ salary }),
    });
  },

  async getBudgetSummary(): Promise<BudgetSummary> {
    return request<BudgetSummary>('/budget/summary');
  },

  async updateAllocation(allocation: Allocation): Promise<any> {
    return request<any>('/budget/allocation', {
      method: 'PUT',
      body: JSON.stringify(allocation),
    });
  },

  async setCustomAllocations(allocations: Record<string, number>): Promise<BudgetSummary> {
    return request<BudgetSummary>('/budget/custom-allocations', {
      method: 'PUT',
      body: JSON.stringify(allocations),
    });
  },
};
