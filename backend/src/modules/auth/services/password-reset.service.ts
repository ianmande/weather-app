import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '@modules/users/users.service';

import { HashService } from '@common/services/hash.service';

import { CredentialsAuthService } from './credentials-auth.service';
import { TokenService } from './token.service';

/**
 * Service for password reset functionality
 */
@Injectable()
export class PasswordResetService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private hashService: HashService,
    private configService: ConfigService,
    private credentialsAuthService: CredentialsAuthService,
  ) {}

  /**
   * Initiates the password reset process
   * @param email - User email address
   * @returns Success message
   */
  async initiatePasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      console.warn('User not found', email);
      return {
        message:
          'Si el correo existe, recibirás un enlace para restablecer tu contraseña',
      };
    }

    const token = await this.tokenService.createPasswordResetToken(user);
    const resetLink = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/auth/reset-password?token=${token}`;

    // Simula el envío de correo (lo registramos en la consola)
    console.log(`[PASSWORD_RESET] Token generado para ${email}: ${resetLink}`);

    return {
      message:
        'Si el correo existe, recibirás un enlace para restablecer tu contraseña',
    };
  }

  /**
   * Completes the password reset process
   * @param token - Reset token
   * @param newPassword - New password
   * @returns Success message
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const payload = await this.tokenService.verifyPasswordResetToken(token);

      // Check if token has been used
      if (this.tokenService.isTokenUsed(payload.tokenId)) {
        throw new UnauthorizedException('Este token ya ha sido utilizado');
      }

      const user = await this.usersService.findUserByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Mark token as used
      this.tokenService.markTokenAsUsed(payload.tokenId);

      // Reset password
      const passwordHash = await this.hashService.hash(newPassword);
      await this.usersService.updateUser(user.id, {
        passwordHash,
      });

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
