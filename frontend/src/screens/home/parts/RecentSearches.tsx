import {useContext} from 'react';

import {RecentSearchItem} from '@components/common/RecentSearchItem';

import {WeatherContext} from '@context/weatherContext';

import {WeatherResponse} from '@interfaces/weather';

export const RecentSearches = () => {
  const {recentSearches} = useContext(WeatherContext);
  if (!recentSearches.length) return null;

  return (
    <section className="mb-8">
      <h3 className="text-lg font-bold mb-4">Búsquedas Recientes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentSearches.slice(0, 4).map((weather: WeatherResponse, index: number) => (
          <RecentSearchItem key={weather.location.name + index} weatherData={weather} />
        ))}
      </div>
    </section>
  );
};
