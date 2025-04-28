import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
  AutocompleteLocation,
  WeatherResponse,
} from '@modules/weather/interfaces/weather-api.interfaces';
import { FavoriteCity } from '@modules/weather/models/favorite-city.entity';
import { WeatherService } from '@modules/weather/weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let configService: ConfigService;
  let cacheManager: any;
  let favoritesRepo: Repository<FavoriteCity>;

  const mockConfigService = {
    get: jest.fn((key) => {
      switch (key) {
        case 'app.weatherApi.apiKey':
          return 'test-api-key';
        case 'app.weatherApi.baseUrl':
          return 'https://api.test.com';
      }
    }),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockFavoritesRepo = {
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: getRepositoryToken(FavoriteCity),
          useValue: mockFavoritesRepo,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    configService = module.get<ConfigService>(ConfigService);
    cacheManager = module.get(CACHE_MANAGER);
    favoritesRepo = module.get<Repository<FavoriteCity>>(
      getRepositoryToken(FavoriteCity),
    );

    // Mock para global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return cached data if available', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockWeatherResponse);

      const result = await service.getWeather('Madrid');

      expect(mockCacheManager.get).toHaveBeenCalledWith('weather_madrid');
      expect(result).toEqual(mockWeatherResponse);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch data from API if no cache available', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockWeatherResponse),
      });

      const result = await service.getWeather('Madrid');

      expect(mockCacheManager.get).toHaveBeenCalledWith('weather_madrid');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/current.json?key=test-api-key&q=Madrid&aqi=no',
      );
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'weather_madrid',
        mockWeatherResponse,
      );
      expect(result).toEqual(mockWeatherResponse);
    });

    it('should throw NotFoundException for 404 responses', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValueOnce({
          error: { code: 1006, message: 'No matching location found.' },
        }),
      });

      await expect(service.getWeather('NonExistentCity')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('autocompleteCity', () => {
    it('should return cached data if available', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockAutocompleteLocations);

      const result = await service.autocompleteCity('Lon');

      expect(mockCacheManager.get).toHaveBeenCalledWith('autocomplete_lon');
      expect(result).toEqual(mockAutocompleteLocations);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch data from API if no cache available', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockAutocompleteLocations),
      });

      const result = await service.autocompleteCity('Lon');

      expect(mockCacheManager.get).toHaveBeenCalledWith('autocomplete_lon');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/search.json?key=test-api-key&q=Lon',
      );
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'autocomplete_lon',
        mockAutocompleteLocations,
      );
      expect(result).toEqual(mockAutocompleteLocations);
    });
  });

  describe('getFavorites', () => {
    it('should filter favorites by userId', async () => {
      const userId = 'user123';
      const favorites = [
        {
          id: '1',
          city: 'Madrid',
          country: 'Spain',
          cityKey: 'madrid,spain',
          userId,
        },
      ];

      mockFavoritesRepo.find.mockResolvedValue(favorites);

      const result = await service.getFavorites(userId);

      expect(mockFavoritesRepo.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });
      expect(result).toEqual(favorites);
    });
  });

  describe('addFavorite', () => {
    it('should return existing favorite if already exists', async () => {
      const userId = 'user123';
      const favoriteDto = {
        city: 'Madrid',
        country: 'Spain',
        cityKey: 'madrid,spain',
      };
      const existingFavorite = { id: '1', ...favoriteDto, userId };

      mockFavoritesRepo.findOne.mockResolvedValue(existingFavorite);

      const result = await service.addFavorite(favoriteDto, userId);

      expect(mockFavoritesRepo.findOne).toHaveBeenCalledWith({
        where: {
          cityKey: favoriteDto.cityKey,
          userId: userId,
        },
      });
      expect(mockFavoritesRepo.create).not.toHaveBeenCalled();
      expect(mockFavoritesRepo.save).not.toHaveBeenCalled();
      expect(result).toEqual(existingFavorite);
    });

    it('should create and save a new favorite if not exists', async () => {
      const userId = 'user123';
      const favoriteDto = {
        city: 'Madrid',
        country: 'Spain',
        cityKey: 'madrid,spain',
      };
      const newFavorite = { id: '1', ...favoriteDto, userId };

      mockFavoritesRepo.findOne.mockResolvedValue(null);
      mockFavoritesRepo.create.mockReturnValue(newFavorite);
      mockFavoritesRepo.save.mockResolvedValue(newFavorite);

      const result = await service.addFavorite(favoriteDto, userId);

      expect(mockFavoritesRepo.findOne).toHaveBeenCalledWith({
        where: {
          cityKey: favoriteDto.cityKey,
          userId: userId,
        },
      });
      expect(mockFavoritesRepo.create).toHaveBeenCalledWith({
        ...favoriteDto,
        userId,
      });
      expect(mockFavoritesRepo.save).toHaveBeenCalledWith(newFavorite);
      expect(result).toEqual(newFavorite);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite if it exists', async () => {
      const cityKey = 'madrid,spain';
      const userId = 'user123';
      const favorite = {
        id: '1',
        city: 'Madrid',
        country: 'Spain',
        cityKey,
        userId,
      };

      mockFavoritesRepo.findOne.mockResolvedValue(favorite);

      await service.removeFavorite(cityKey, userId);

      expect(mockFavoritesRepo.findOne).toHaveBeenCalledWith({
        where: {
          cityKey,
          userId,
        },
      });
      expect(mockFavoritesRepo.remove).toHaveBeenCalledWith(favorite);
    });

    it('should throw NotFoundException if favorite does not exist', async () => {
      const cityKey = 'nonexistent,city';
      const userId = 'user123';

      mockFavoritesRepo.findOne.mockResolvedValue(null);

      await expect(service.removeFavorite(cityKey, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockFavoritesRepo.remove).not.toHaveBeenCalled();
    });
  });
});
