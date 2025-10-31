import apiClient from './client';
import type { User } from '@/types/user';

type AuthResponse = {
  user: User;
  token: string;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return data;
};

export const register = async (payload: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await apiClient.post('/auth/reset', { email });
};
