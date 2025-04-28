import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from '../services/token.service';
import { PasswordResetPayload } from '../types/password-reset.token';

/**
 * Pipe to validate JWT tokens
 */
@Injectable()
export class TokenValidationPipe implements PipeTransform {
  constructor(private tokenService: TokenService) {}

  /**
   * Transforms and validates the token
   * @param token - Token to validate
   * @param metadata - Metadata about the parameter being processed
   * @returns Validated token
   */
  async transform(
    token: string,
    metadata: ArgumentMetadata,
  ): Promise<PasswordResetPayload> {
    if (!token) {
      throw new BadRequestException('Token es requerido');
    }

    try {
      if (metadata.data !== 'passwordResetToken') {
        throw new BadRequestException('Tipo de token desconocido');
      }

      const payload = await this.tokenService.verifyPasswordResetToken(token);

      // Check if token has been used
      if (this.tokenService.isTokenUsed(payload.tokenId)) {
        throw new UnauthorizedException('Este token ya ha sido utilizado');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Token inválido o expirado');
    }
  }
}
