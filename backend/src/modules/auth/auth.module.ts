import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@modules/users/users.module';

import { HashModule } from '@common/services/hash.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// Guards
import { AuthGuard } from './guards/auth.guard';
// Pipes
import { TokenValidationPipe } from './pipes/token-validation.pipe';
// Services
import { CredentialsAuthService } from './services/credentials-auth.service';
import { PasswordResetService } from './services/password-reset.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    UsersModule,
    HashModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    TokenService,
    CredentialsAuthService,
    PasswordResetService,
    TokenValidationPipe,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
