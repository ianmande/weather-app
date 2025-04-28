import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { AddFavoriteDto } from './dtos/add-favorite.dto';
import {
  WeatherResponse,
  AutocompleteLocation,
  WeatherApiErrorResponse,
} from './interfaces/weather-api.interfaces';
import { FavoriteCity } from './models/favorite-city.entity';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FavoriteCity)
    private readonly favoritesRepository: Repository<FavoriteCity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.apiKey = this.configService.get<string>('app.weatherApi.apiKey') || '';
    this.baseUrl =
      this.configService.get<string>('app.weatherApi.baseUrl') || '';

    this.logger.log(
      `WeatherAPI configurada con: baseUrl=${this.baseUrl}, apiKey=${this.apiKey.substring(0, 4)}...`,
    );
  }

  async getWeather(city: string): Promise<WeatherResponse> {
    try {
      const cacheKey = `weather_${city.toLowerCase()}`;
      const cachedData = await this.cacheManager.get<WeatherResponse>(cacheKey);

      if (cachedData) {
        this.logger.log(`Returning cached weather data for ${city}`);
        return cachedData;
      }

      const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}&aqi=no`;
      this.logger.log(
        `Haciendo petición a: ${url.replace(this.apiKey, 'API_KEY')}`,
      );

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = (await response.json()) as WeatherApiErrorResponse;
        this.logger.error(
          `Error de API: status=${response.status}, body=`,
          errorData,
        );

        if (response.status === 400 || response.status === 404) {
          throw new NotFoundException(`Ciudad "${city}" no encontrada`);
        }

        throw new HttpException(
          `Error en API externa: ${errorData?.error?.message || 'Error desconocido'}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const data = await response.json();
      this.logger.log(`Respuesta recibida para ${city}`);

      await this.cacheManager.set(cacheKey, data);
      return data as WeatherResponse;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error fetching weather for ${city}:`, error);
      throw new InternalServerErrorException(
        `Error al obtener datos del clima: ${error}`,
      );
    }
  }

  async autocompleteCity(query: string): Promise<AutocompleteLocation[]> {
    try {
      const cacheKey = `autocomplete_${query.toLowerCase()}`;
      const cachedData =
        await this.cacheManager.get<AutocompleteLocation[]>(cacheKey);

      if (cachedData) {
        this.logger.log(`Returning cached autocomplete data for ${query}`);
        return cachedData;
      }

      const url = `${this.baseUrl}/search.json?key=${this.apiKey}&q=${encodeURIComponent(query)}`;
      this.logger.log(
        `Haciendo petición a: ${url.replace(this.apiKey, 'API_KEY')}`,
      );

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = (await response.json()) as WeatherApiErrorResponse;
        this.logger.error(
          `Error de API en autocompletado: status=${response.status}, body=`,
          errorData,
        );

        throw new HttpException(
          `Error en API externa: ${errorData?.error?.message || 'Error desconocido'}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const data = await response.json();
      this.logger.log(`Respuesta de autocompletado recibida para ${query}`);

      await this.cacheManager.set(cacheKey, data);
      return data as AutocompleteLocation[];
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error autocompleting city ${query}:`, error);
      throw new InternalServerErrorException(
        `Error al buscar ciudades: ${error}`,
      );
    }
  }

  async getFavorites(userId: string) {
    const favorites = await this.favoritesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    return favorites;
  }

  async addFavorite(
    favoriteDto: AddFavoriteDto,
    userId: string,
  ): Promise<FavoriteCity> {
    const existingFavorite = await this.favoritesRepository.findOne({
      where: {
        cityKey: favoriteDto.cityKey,
        userId: userId,
      },
    });

    if (existingFavorite) {
      return existingFavorite;
    }

    const favorite = this.favoritesRepository.create({
      ...favoriteDto,
      userId: userId,
    });

    return this.favoritesRepository.save(favorite);
  }

  async removeFavorite(city: string, userId: string): Promise<void> {
    this.logger.log(
      `Eliminando ciudad favorita ${city} para usuario: ${userId}`,
    );

    const favorite = await this.favoritesRepository.findOne({
      where: {
        cityKey: city,
        userId: userId,
      },
    });

    if (!favorite) {
      throw new NotFoundException(
        `Ciudad favorita con clave ${city} no encontrada para el usuario`,
      );
    }

    await this.favoritesRepository.remove(favorite);
    this.logger.log(`Ciudad favorita eliminada con éxito: ${city}`);

    // Retornar objeto vacío para evitar problemas con el interceptor
    return;
  }
}
