export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes
  PROFILE: '/profile',
  HOME: '/', // Posts feed

  // Protected routes - Admin
  DASHBOARD: '/dashboard', // User and posts management
};

// Types for routes
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
