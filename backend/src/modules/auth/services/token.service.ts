import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { v4 as uuidv4 } from 'uuid';

import { User } from '@modules/users/entities/user.entity';

import { JwtPayload } from '@common/types/user';

import { PasswordResetPayload } from '../types/password-reset.token';

/**
 * Service for managing JWT tokens
 */
@Injectable()
export class TokenService {
  private usedTokens: Map<string, boolean> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Creates a JWT token for authentication
   * @param user - User entity
   * @returns JWT token
   */
  async createAuthToken(user: User): Promise<string> {
    const payload: Partial<JwtPayload> = {
      id: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }

  /**
   * Creates a password reset token
   * @param user - User entity
   * @returns Password reset token
   */
  async createPasswordResetToken(user: User): Promise<string> {
    const tokenId = uuidv4();

    const payload: PasswordResetPayload = {
      email: user.email,
      type: 'password-reset',
      tokenId,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '30m',
    });
  }

  /**
   * Verifies a password reset token
   * @param token - Password reset token
   * @returns Verified token payload
   */
  async verifyPasswordResetToken(token: string): Promise<PasswordResetPayload> {
    const payload = await this.jwtService.verifyAsync<PasswordResetPayload>(
      token,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    if (payload.type !== 'password-reset') {
      throw new Error('Token inválido');
    }

    return payload;
  }

  /**
   * Checks if a token has been used
   * @param tokenId - Unique token ID
   * @returns True if token has been used
   */
  isTokenUsed(tokenId: string): boolean {
    return this.usedTokens.has(tokenId);
  }

  /**
   * Marks a token as used
   * @param tokenId - Unique token ID
   */
  markTokenAsUsed(tokenId: string): void {
    this.usedTokens.set(tokenId, true);

    setTimeout(
      () => {
        this.usedTokens.delete(tokenId);
      },
      30 * 60 * 1000,
    );
  }
}
