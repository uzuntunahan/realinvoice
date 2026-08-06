import { LoginResponse } from '../types';

const BASE_URL = 'http://localhost:8080/api/auth';

export const authService = {
  login: async (userName: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, password }),
    });
    return response.json();
  }
};