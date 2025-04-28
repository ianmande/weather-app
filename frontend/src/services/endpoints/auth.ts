import {RegisterRequest, LoginRequest, AuthResponse} from '@interfaces/user';

import {request} from '@services/api.service';

/**
 * Creates a new user with provided data
 * @param userData - User data for registration
 * @returns API response
 */
export const register = async (userData: RegisterRequest) => {
  try {
    const response = await request.post<AuthResponse>('/users', userData);
    return response;
  } catch (error) {
    console.error('Error creating user', error);
    throw error;
  }
};

/**
 * Authenticates a user with credentials
 * @param credentials - Login credentials
 * @returns API response
 */
export const login = async (credentials: LoginRequest) => {
  try {
    const response = await request.post<AuthResponse>('/auth/login', credentials);
    return response;
  } catch (error) {
    console.error('Error logging in', error);
    throw error;
  }
};
