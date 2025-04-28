import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';

import { HashService } from '@common/services/hash.service';

import { TokenService } from './token.service';

/**
 * Service for handling credentials-based authentication
 */
@Injectable()
export class CredentialsAuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private tokenService: TokenService,
  ) {}

  /**
   * Authenticates a user with email and password
   * @param email - User email
   * @param password - User password
   * @returns User and access token
   */
  async authenticate(
    email: string,
    password: string,
  ): Promise<{ user: User; access_token: string }> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const access_token = await this.tokenService.createAuthToken(user);

    return { user, access_token };
  }

  /**
   * Resets a user's password
   * @param email - User email
   * @param newPassword - New password
   */
  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordHash = await this.hashService.hash(newPassword);

    await this.usersService.updateUser(user.id, {
      passwordHash,
    });
  }
}
