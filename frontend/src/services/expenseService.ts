import { request } from './api';
import { Expense } from '../types';

export interface ExpenseFilterParams {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export const expenseService = {
  async addExpense(data: {
    title: string;
    amount: number;
    category: string;
    date: string;
    description?: string;
  }): Promise<Expense> {
    return request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getExpenses(params: ExpenseFilterParams = {}): Promise<Expense[]> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const qs = query.toString();
    return request<Expense[]>(`/expenses${qs ? `?${qs}` : ''}`);
  },

  async deleteExpense(id: string): Promise<void> {
    return request<void>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};
