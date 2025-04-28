import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsString, IsUUID } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

/**
 * Data Transfer Object for updating a user
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'ID of the user who updated this record',
    required: false,
  })
  @IsString()
  @IsUUID('4')
  updatedBy?: string;
}
