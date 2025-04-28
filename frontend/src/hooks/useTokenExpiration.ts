import {useCallback, useEffect, useRef} from 'react';

import {jwtDecode} from 'jwt-decode';
import {toast} from 'react-toastify';

import {TOKEN_EXPIRATION_CHECK_INTERVAL, TOKEN_EXPIRATION_MARGIN} from '@config/auth.config';

import {useAuth} from './useAuth';

/**
 * Hook to periodically check if the JWT token has expired
 * and automatically log out the user if necessary
 */
export const useTokenExpiration = (checkInterval = TOKEN_EXPIRATION_CHECK_INTERVAL) => {
  const {token, isAuthenticated, logout} = useAuth();
  const timerRef = useRef<number | null>(null);

  const checkTokenExpiration = useCallback(() => {
    if (!isAuthenticated || !token) return;

    try {
      const decodedToken = jwtDecode<{exp: number}>(token);
      const currentTime = Date.now() / 1000;

      if (!decodedToken.exp) {
        console.error('Token no contiene fecha de expiración');
        return;
      }

      if (decodedToken.exp <= currentTime + TOKEN_EXPIRATION_MARGIN) {
        logout();
        toast.info('La sesión ha expirado. Por favor, inicie sesión nuevamente.');
      }
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      logout();
    }
  }, [isAuthenticated, token, logout]);

  useEffect(() => {
    if (isAuthenticated && token) {
      checkTokenExpiration();

      timerRef.current = window.setInterval(checkTokenExpiration, checkInterval);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }

    return undefined;
  }, [isAuthenticated, token, checkInterval, checkTokenExpiration]);
};
