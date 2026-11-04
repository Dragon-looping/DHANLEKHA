import { request } from './api';
import { User } from '../types';

export const authService = {
  async signup(data: { name: string; email: string; password: string; confirmPassword: string }): Promise<User> {
    return request<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }): Promise<User> {
    return request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<void> {
    return request<void>('/auth/logout', {
      method: 'POST',
    });
  },

  async getCurrentUser(): Promise<User> {
    return request<User>('/auth/me');
  },
};
