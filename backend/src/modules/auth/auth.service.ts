import { Injectable } from '@nestjs/common';

import { CredentialsAuthService } from './services/credentials-auth.service';
import { PasswordResetService } from './services/password-reset.service';

/**
 * Main authentication service that coordinates all auth functionality
 */
@Injectable()
export class AuthService {
  constructor(
    private credentialsAuthService: CredentialsAuthService,
    private passwordResetService: PasswordResetService,
  ) {}

  /**
   * Authenticates a user with email and password
   * @param email - User email
   * @param password - User password
   * @returns Auth token and user data
   */
  async sigIn(email: string, password: string) {
    const { user, access_token } =
      await this.credentialsAuthService.authenticate(email, password);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  /**
   * Initiates the password reset process
   * @param email - User's email address
   * @returns Success message
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.passwordResetService.initiatePasswordReset(email);
  }

  /**
   * Resets a user's password
   * @param token - Reset token
   * @param newPassword - New password
   * @returns Success message
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    return this.passwordResetService.resetPassword(token, newPassword);
  }
}
