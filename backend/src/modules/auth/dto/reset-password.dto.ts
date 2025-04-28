import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

/**
 * Data Transfer Object for resetting password
 */
export class ResetPasswordDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Reset token sent to user email',
  })
  @IsString({ message: 'El token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El token es requerido' })
  token: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'New password',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])/, {
    message: 'La contraseña debe contener al menos una letra y un número',
  })
  password: string;
}
