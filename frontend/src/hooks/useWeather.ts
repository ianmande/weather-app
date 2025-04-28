import {useState, useCallback, useContext} from 'react';

import {toast} from 'react-toastify';

import {WeatherContext} from '@context/weatherContext';

import {CityAutocompleteResponse} from '@interfaces/weather';

import {getWeather, autocompleteCity} from '@services/endpoints/weather';

export const useWeather = () => {
  const [loading, setLoading] = useState(false);
  const [autocompleteCities, setAutocompleteCities] = useState<CityAutocompleteResponse[]>([]);

  const {weatherData, setWeatherData, recentSearches, setRecentSearches} = useContext(WeatherContext);

  const fetchWeather = useCallback(
    async (city: string) => {
      setLoading(true);
      const existingCity = recentSearches.find((search) => search.location.name === city);

      if (existingCity) {
        setWeatherData(existingCity);
        setLoading(false);
        return existingCity;
      }

      try {
        const response = await getWeather(city);
        if (response.success) {
          if (recentSearches.length >= 4) {
            const newRecentSearches = [response.data, ...recentSearches.slice(0, 3)];
            setRecentSearches(newRecentSearches);
          } else {
            setRecentSearches([response.data, ...recentSearches]);
          }

          setWeatherData(response.data);

          return response.data;
        } else {
          toast.error(response.message || 'Error al obtener el clima');
          return null;
        }
      } catch (error) {
        console.error('Error al obtener el clima:', error);
        toast.error('Error al conectar con el servidor');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [recentSearches, setRecentSearches, setWeatherData],
  );

  const searchCities = useCallback(async (query: string) => {
    if (!query.trim()) {
      setAutocompleteCities([]);
      return [];
    }

    setLoading(true);
    try {
      const response = await autocompleteCity(query);
      if (response.success) {
        const cities = Array.isArray(response.data) ? response.data : [response.data];
        setAutocompleteCities(cities);
        return cities;
      } else {
        toast.error(response.message || 'Error al buscar ciudades');
        return [];
      }
    } catch (error) {
      console.error('Error al buscar ciudades:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    weatherData,
    autocompleteCities,
    fetchWeather,
    searchCities,
  };
};
