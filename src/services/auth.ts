import { api } from './api';
import { ApiResponse, UserProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';

export interface LoginPayload {
  email: string;
  password?: string;
  fullName?: string;
  phone?: string;
}

export interface AuthResult {
  user: UserProfile;
  token: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResult>> {
    const res = await api.post<AuthResult>('/auth/login', payload);
    if (res.success && res.data?.token) {
      api.setToken(res.data.token);
      return res;
    }
    // Fallback development mock response
    const mockUser: UserProfile = {
      ...INITIAL_USER_PROFILE,
      email: payload.email || INITIAL_USER_PROFILE.email,
      fullName: payload.fullName || INITIAL_USER_PROFILE.fullName,
      phone: payload.phone || INITIAL_USER_PROFILE.phone,
    };
    const mockToken = 'mock_jwt_token_' + Date.now();
    api.setToken(mockToken);
    return {
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
      },
    };
  },

  async register(payload: LoginPayload): Promise<ApiResponse<AuthResult>> {
    const res = await api.post<AuthResult>('/auth/register', payload);
    if (res.success && res.data?.token) {
      api.setToken(res.data.token);
      return res;
    }
    const mockUser: UserProfile = {
      ...INITIAL_USER_PROFILE,
      id: 'user_' + Date.now(),
      email: payload.email,
      fullName: payload.fullName || 'New Adventurer',
      phone: payload.phone,
      onboardingCompleted: false,
    };
    const mockToken = 'mock_jwt_token_' + Date.now();
    api.setToken(mockToken);
    return {
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
      },
    };
  },

  async logout(): Promise<ApiResponse<null>> {
    const res = await api.post<null>('/auth/logout');
    api.setToken(null);
    return res.success ? res : { success: true, data: null };
  },

  async getMe(): Promise<ApiResponse<UserProfile>> {
    const res = await api.get<UserProfile>('/auth/me');
    if (res.success && res.data) {
      return res;
    }
    return {
      success: true,
      data: INITIAL_USER_PROFILE,
    };
  },
};
