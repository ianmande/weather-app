/**
 * Configuration for authentication and token management
 */

// Interval to check token expiration (in milliseconds)
// Default: 5 minutes (300,000 ms)
export const TOKEN_EXPIRATION_CHECK_INTERVAL = 5 * 60 * 1000;

// Time margin before token expiration to consider it invalid (in seconds)
// Default: 30 seconds
export const TOKEN_EXPIRATION_MARGIN = 30;

// Maximum inactivity time before logging out (in milliseconds)
// Default: 15 minutes
export const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
