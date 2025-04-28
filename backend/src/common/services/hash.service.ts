import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds = 12;

  /**
   * Hashes a plain text password
   * @param password - Plain text password to hash
   * @returns Hashed password
   */
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compares a plain text password with a hashed password
   * @param plainPassword - Plain text password to compare
   * @param hashedPassword - Hashed password from database
   * @returns True if passwords match, false otherwise
   */
  compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
