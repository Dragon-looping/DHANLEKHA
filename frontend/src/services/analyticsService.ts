import { request } from './api';
import { AnalyticsSummary, CategoryBreakdownItem } from '../types';

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    return request<AnalyticsSummary>('/analytics/summary');
  },

  async getCategoryBreakdown(): Promise<CategoryBreakdownItem[]> {
    return request<CategoryBreakdownItem[]>('/analytics/categories');
  },
};
