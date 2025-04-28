import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherQueryDto {
  @ApiProperty({
    description: 'Ciudad para consultar el clima',
    example: 'Madrid',
  })
  @IsNotEmpty()
  @IsString()
  city: string;
}
