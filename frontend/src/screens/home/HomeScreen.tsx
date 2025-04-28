import {useState} from 'react';

import {SearchBar} from '@components/common/SearchBar';

import {useWeather} from '@hooks/useWeather';

import {CurrentCityWeather} from './parts/CurrentCityWeather';
import {Favorites} from './parts/Favorites';
import {RecentSearches} from './parts/RecentSearches';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const {searchCities, autocompleteCities, weatherData, loading, fetchWeather} = useWeather();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto w-full px-4 py-6">
          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchCities={searchCities}
            autocompleteCities={autocompleteCities}
            loading={loading}
            fetchWeather={fetchWeather}
          />
          {/* Current Weather */}
          <CurrentCityWeather weatherData={weatherData} loading={loading} />

          {/* Recent Searches */}
          <RecentSearches />

          {/* Favorite Cities */}
          <Favorites />
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
