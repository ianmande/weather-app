import {useCallback, useEffect, useRef} from 'react';

import {toast} from 'react-toastify';

import {INACTIVITY_TIMEOUT} from '@config/auth.config';

import {useAuth} from './useAuth';

/**
 * Hook to log out after a period of inactivity
 * Listens for user interaction events to reset the timer
 */
export const useInactivityTimeout = (timeout = INACTIVITY_TIMEOUT) => {
  const {isAuthenticated, logout} = useAuth();
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (isAuthenticated) {
      timeoutRef.current = window.setTimeout(() => {
        logout();
        toast.info('Se cerró la sesión por inactividad');
      }, timeout);
    }
  }, [logout, isAuthenticated, timeout]);

  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

      resetTimeout();

      events.forEach((event) => {
        window.addEventListener(event, resetTimeout);
      });

      return () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }

        events.forEach((event) => {
          window.removeEventListener(event, resetTimeout);
        });
      };
    }

    return undefined;
  }, [isAuthenticated, timeout, logout, resetTimeout]);
};
