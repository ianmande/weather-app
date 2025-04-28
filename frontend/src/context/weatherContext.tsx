import {createContext, Dispatch, SetStateAction, useEffect, useState} from 'react';

import {useLocalStorage} from '@hooks/useLocalStorage';

import {FavoriteCity, WeatherResponse} from '@interfaces/weather';

type WeatherContextType = {
  favorites: FavoriteCity[];
  setFavorites: Dispatch<SetStateAction<FavoriteCity[]>>;
  recentSearches: WeatherResponse[];
  weatherData: WeatherResponse | null;
  setWeatherData: Dispatch<SetStateAction<WeatherResponse | null>>;
  setRecentSearches: Dispatch<SetStateAction<WeatherResponse[]>>;
};

const WeatherContext = createContext<WeatherContextType>({
  favorites: [],
  setFavorites: () => {},
  recentSearches: [],
  weatherData: null,
  setWeatherData: () => {},
  setRecentSearches: () => {},
});

const WeatherProvider = ({children}: {children: React.ReactNode}) => {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const {storedValue, setValue} = useLocalStorage<WeatherResponse[]>('recentSearches', []);
  const [recentSearches, setRecentSearches] = useState<WeatherResponse[]>(storedValue);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(recentSearches[0] || null);

  useEffect(() => {
    setValue(recentSearches);
    console.log('recentSearches', recentSearches);
  }, [recentSearches, setValue]);

  return (
    <WeatherContext.Provider
      value={{favorites, setFavorites, recentSearches, weatherData, setWeatherData, setRecentSearches}}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export {WeatherProvider, WeatherContext};
