import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { Request } from 'express';

import { Public } from '@common/decorators/public.decorator';
import { JwtPayload } from '@common/types/user';

import { AddFavoriteDto } from './dtos/add-favorite.dto';
import { AutocompleteQueryDto } from './dtos/autocomplete-query.dto';
import { WeatherQueryDto } from './dtos/weather-query.dto';
import {
  WeatherResponse,
  AutocompleteLocation,
} from './interfaces/weather-api.interfaces';
import { FavoriteCity } from './models/favorite-city.entity';
import { WeatherService } from './weather.service';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@ApiTags('Clima')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtener datos del clima de una ciudad' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve información del clima para la ciudad especificada',
  })
  @ApiResponse({
    status: 404,
    description: 'Ciudad no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
  })
  async getWeather(@Query() query: WeatherQueryDto): Promise<WeatherResponse> {
    return this.weatherService.getWeather(query.city);
  }

  @Get('autocomplete')
  @Public()
  @ApiOperation({ summary: 'Obtener sugerencias de ciudades' })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve sugerencias de ciudades basadas en el texto de búsqueda',
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
  })
  async autocompleteCity(
    @Query() query: AutocompleteQueryDto,
  ): Promise<AutocompleteLocation[]> {
    return this.weatherService.autocompleteCity(query.query);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Obtener lista de ciudades favoritas' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la lista de ciudades favoritas',
  })
  async getFavorites(
    @Req() req: RequestWithUser,
  ): Promise<FavoriteCity[] | []> {
    const userId = String(req.user.id);
    return this.weatherService.getFavorites(userId);
  }

  @Post('favorites')
  @ApiOperation({ summary: 'Agregar ciudad a favoritos' })
  @ApiResponse({
    status: 201,
    description: 'Ciudad agregada a favoritos',
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
  })
  async addFavorite(
    @Body() favoriteDto: AddFavoriteDto,
    @Req() req: RequestWithUser,
  ): Promise<FavoriteCity> {
    const userId = String(req.user.id);

    return this.weatherService.addFavorite(favoriteDto, userId);
  }

  @Delete('favorites/:city')
  @ApiOperation({ summary: 'Eliminar ciudad de favoritos' })
  @ApiResponse({
    status: 204,
    description: 'Ciudad eliminada de favoritos',
  })
  @ApiResponse({
    status: 404,
    description: 'Ciudad favorita no encontrada',
  })
  @ApiParam({ name: 'city', description: 'Clave única de la ciudad' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavorite(
    @Param('city') city: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const userId = String(req.user.id);
    await this.weatherService.removeFavorite(city, userId);
    // No retornamos nada para un 204 No Content
  }
}
