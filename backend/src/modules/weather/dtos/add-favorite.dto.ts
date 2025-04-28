import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AddFavoriteDto {
  @ApiProperty({
    description: 'Nombre de la ciudad',
    example: 'Madrid',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'País de la ciudad',
    example: 'Spain',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Región de la ciudad',
    example: 'Madrid',
    required: false,
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({
    description: 'Clave única de la ciudad (generalmente ciudad,país)',
    example: 'madrid,spain',
  })
  @IsNotEmpty()
  @IsString()
  cityKey: string;
}
