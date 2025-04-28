import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AutocompleteQueryDto {
  @ApiProperty({
    description: 'Texto para buscar ciudades',
    example: 'Lon',
    minLength: 2,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  query: string;
}
