import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRegistrationPipe implements PipeTransform {
  constructor() {}

  transform(value: CreateUserDto) {
    if (!this.isValidEmail(value.email)) {
      throw new BadRequestException('Email no tiene un formato válido');
    }

    if (value.email.includes('spam')) {
      throw new BadRequestException('Email no válido');
    }

    if (!this.isPasswordComplex(value.password)) {
      throw new BadRequestException(
        'La contraseña no cumple con la complejidad mínima',
      );
    }

    return value;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isPasswordComplex(password: string): boolean {
    const hasNumber = /\d/.test(password);
    const hasLetter = /[A-Za-z]/.test(password);

    return hasNumber && hasLetter && password.length >= 6;
  }
}
