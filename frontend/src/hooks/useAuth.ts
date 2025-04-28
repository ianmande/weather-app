import {useCallback} from 'react';

import {User, LoginRequest, RegisterRequest} from '@interfaces/user';

import {login as loginService, register as registerService} from '@services/endpoints/auth';

import {useLocalStorage} from './useLocalStorage';

interface AuthState {
  access_token: string | null;
  user: User | null;
}

export const useAuth = () => {
  const {
    storedValue: authState,
    setValue: setAuthState,
    removeValue: removeAuthState,
  } = useLocalStorage<AuthState>('auth', {
    access_token: null,
    user: null,
  });

  const isAuthenticated = !!authState.access_token;

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await loginService(credentials);

      if (response.success) {
        const {access_token, user} = response.data;

        // Guardar en localStorage a través del hook
        setAuthState({access_token, user});

        return {success: true, user};
      }

      return {success: false, error: response.message};
    } catch (error) {
      console.error('Error during login:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al iniciar sesión',
      };
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await registerService(userData);

      if (response.success) {
        const {access_token, user} = response.data;

        setAuthState({access_token, user});

        return {success: true, user};
      }

      return {success: false, error: response.message};
    } catch (error) {
      console.error('Error during registration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al registrarse',
      };
    }
  };

  const logout = useCallback(() => {
    removeAuthState();
  }, [removeAuthState]);

  return {
    user: authState.user,
    token: authState.access_token,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
