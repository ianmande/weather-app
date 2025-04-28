/**
 * Interface for password reset token payload
 */
export interface PasswordResetPayload {
  email: string;
  type: 'password-reset';
  tokenId: string;
}
