import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@modules/users/entities/user.entity';
import { AddFavoriteDto } from '@modules/weather/dtos/add-favorite.dto';
import { AutocompleteQueryDto } from '@modules/weather/dtos/autocomplete-query.dto';
import { WeatherQueryDto } from '@modules/weather/dtos/weather-query.dto';
import {
  AutocompleteLocation,
  WeatherResponse,
} from '@modules/weather/interfaces/weather-api.interfaces';
import { FavoriteCity } from '@modules/weather/models/favorite-city.entity';
import { WeatherController } from '@modules/weather/weather.controller';
import { WeatherService } from '@modules/weather/weather.service';

describe('WeatherController', () => {
  let controller: WeatherController;
  let weatherService: WeatherService;

  const mockWeatherResponse: WeatherResponse = {
    location: {
      name: 'Madrid',
      region: 'Madrid',
      country: 'Spain',
      lat: 40.4,
      lon: -3.68,
      tz_id: 'Europe/Madrid',
      localtime_epoch: 1619712345,
      localtime: '2021-04-29 12:45',
    },
    current: {
      last_updated_epoch: 1619712000,
      last_updated: '2021-04-29 12:40',
      temp_c: 25.0,
      temp_f: 77.0,
      is_day: 1,
      condition: {
        text: 'Sunny',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        code: 1000,
      },
      wind_mph: 5.6,
      wind_kph: 9.0,
      wind_degree: 220,
      wind_dir: 'SW',
      pressure_mb: 1015.0,
      pressure_in: 30.4,
      precip_mm: 0.0,
      precip_in: 0.0,
      humidity: 40,
      cloud: 0,
      feelslike_c: 24.5,
      feelslike_f: 76.1,
      vis_km: 10.0,
      vis_miles: 6.2,
      uv: 6.0,
      gust_mph: 8.5,
      gust_kph: 13.7,
    },
  };

  const mockAutocompleteLocations: AutocompleteLocation[] = [
    {
      id: 1,
      name: 'London',
      region: 'City of London, Greater London',
      country: 'United Kingdom',
      lat: 51.52,
      lon: -0.11,
      url: 'london-city-of-london-greater-london-united-kingdom',
    },
    {
      id: 2,
      name: 'Londonderry',
      region: 'New Hampshire',
      country: 'United States of America',
      lat: 42.87,
      lon: -71.37,
      url: 'londonderry-new-hampshire-united-states-of-america',
    },
  ];

  // Mock de usuario para las pruebas
  const mockUser: User = {
    id: 'user123',
    email: 'test@example.com',
    passwordHash: 'hash',
    createdAt: new Date(),
    updatedAt: new Date(),
    favoriteCities: [],
  };

  const mockFavorites: FavoriteCity[] = [
    {
      id: '1',
      city: 'Madrid',
      country: 'Spain',
      region: 'Madrid',
      cityKey: 'madrid,spain',
      userId: 'user123',
      user: mockUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockWeatherService = {
    getWeather: jest.fn(),
    autocompleteCity: jest.fn(),
    getFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
  };

  // Mock de petición con usuario
  const mockRequest = {
    user: {
      id: 'user123',
      email: 'test@example.com',
    },
    // Agregar propiedades mínimas necesarias para satisfacer el tipo
    headers: {},
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
  } as any; // Usamos any para evitar tener que implementar todas las propiedades de Request

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return weather data for the specified city', async () => {
      const query: WeatherQueryDto = { city: 'Madrid' };
      mockWeatherService.getWeather.mockResolvedValue(mockWeatherResponse);

      const result = await controller.getWeather(query);

      expect(weatherService.getWeather).toHaveBeenCalledWith('Madrid');
      expect(result).toEqual(mockWeatherResponse);
    });
  });

  describe('autocompleteCity', () => {
    it('should return autocomplete suggestions for the query', async () => {
      const query: AutocompleteQueryDto = { query: 'London' };
      mockWeatherService.autocompleteCity.mockResolvedValue(
        mockAutocompleteLocations,
      );

      const result = await controller.autocompleteCity(query);

      expect(weatherService.autocompleteCity).toHaveBeenCalledWith('London');
      expect(result).toEqual(mockAutocompleteLocations);
    });
  });

  describe('getFavorites', () => {
    it('should return favorites for the user', async () => {
      mockWeatherService.getFavorites.mockResolvedValue(mockFavorites);

      const result = await controller.getFavorites(mockRequest);

      expect(weatherService.getFavorites).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockFavorites);
    });
  });

  describe('addFavorite', () => {
    it('should add a city to favorites', async () => {
      const favoriteDto: AddFavoriteDto = {
        city: 'Madrid',
        country: 'Spain',
        region: 'Madrid',
        cityKey: 'madrid,spain',
      };

      mockWeatherService.addFavorite.mockResolvedValue(mockFavorites[0]);

      const result = await controller.addFavorite(favoriteDto, mockRequest);

      expect(weatherService.addFavorite).toHaveBeenCalledWith(
        favoriteDto,
        'user123',
      );
      expect(result).toEqual(mockFavorites[0]);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a city from favorites', async () => {
      const cityKey = 'madrid,spain';
      mockWeatherService.removeFavorite.mockResolvedValue(undefined);

      await controller.removeFavorite(cityKey, mockRequest);

      expect(weatherService.removeFavorite).toHaveBeenCalledWith(
        cityKey,
        'user123',
      );
    });

    it('should throw NotFoundException if favorite not found', async () => {
      const cityKey = 'nonexistent,city';
      mockWeatherService.removeFavorite.mockRejectedValue(
        new NotFoundException(
          `Ciudad favorita con clave ${cityKey} no encontrada para el usuario`,
        ),
      );

      await expect(
        controller.removeFavorite(cityKey, mockRequest),
      ).rejects.toThrow(NotFoundException);
      expect(weatherService.removeFavorite).toHaveBeenCalledWith(
        cityKey,
        'user123',
      );
    });
  });
});
