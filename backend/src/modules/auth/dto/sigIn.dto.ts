import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, MinLength } from 'class-validator';

export class SigInDto {
  @IsEmail()
  @ApiProperty({ example: 'iansaacmdz@gmail.com' })
  email: string;

  @MinLength(6)
  @ApiProperty({ example: 'Qaz12345', minLength: 6 })
  password: string;
}
