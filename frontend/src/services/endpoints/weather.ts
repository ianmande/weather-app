import {CityAutocompleteResponse, FavoriteCity, WeatherResponse} from '@interfaces/weather';

import {request} from '@services/api.service';

export const getWeather = async (city: string) => {
  try {
    const response = await request.get<WeatherResponse>('/weather', {
      params: {city},
    });

    return response;
  } catch (error) {
    console.error('Error al obtener el clima', error);
    throw error;
  }
};

export const autocompleteCity = async (query: string) => {
  try {
    const response = await request.get<CityAutocompleteResponse>('/weather/autocomplete', {
      params: {query},
    });

    return response;
  } catch (error) {
    console.error('Error al buscar ciudades', error);
    throw error;
  }
};

export const getFavoriteCities = async () => {
  try {
    const response = await request.get<FavoriteCity[]>('/weather/favorites');

    return response;
  } catch (error) {
    console.error('Error al obtener ciudades favoritas', error);
    throw error;
  }
};

export const addFavoriteCity = async (favoriteCity: FavoriteCity) => {
  try {
    const response = await request.post<{message: string}>('/weather/favorites', favoriteCity);

    return response;
  } catch (error) {
    console.error('Error al agregar ciudad a favoritos', error);
    throw error;
  }
};

export const removeFavoriteCity = async (city: string) => {
  try {
    const response = await request.delete<{message: string}>(`/weather/favorites/${city}`);

    return response;
  } catch (error) {
    console.error('Error al eliminar ciudad de favoritos', error);
    throw error;
  }
};
