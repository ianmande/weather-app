import {useState, useEffect, useRef} from 'react';

import {Search} from 'lucide-react';

import {Input} from '@components/ui/input';

import {useDebounce} from '@hooks/useDebounce';

import {CityAutocompleteResponse} from '@interfaces/weather';

type Props = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchCities: (query: string) => void;
  autocompleteCities: CityAutocompleteResponse[];
  loading: boolean;
  fetchWeather: (city: string) => void;
};

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchCities,
  autocompleteCities,
  loading,
  fetchWeather,
}: Props) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      searchCities(debouncedSearchTerm);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, searchCities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (cityName: string) => {
    setInputValue('');
    setSearchQuery('');
    setShowSuggestions(false);

    fetchWeather(cityName);
  };

  return (
    <div className="relative max-w-md mx-auto mb-8 bg-white rounded-md shadow-md" ref={searchRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Buscar ciudad..."
        className="pl-10 pr-4"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSuggestionClick(inputValue);
          }
        }}
        onFocus={() => inputValue.trim() && setShowSuggestions(true)}
      />

      {showSuggestions && autocompleteCities?.length > 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto z-10 border border-gray-200">
          <ul className="py-1">
            {autocompleteCities.map((city) => (
              <li
                key={city.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(city.name)}
              >
                <div className="font-medium">{city.name}</div>
                <div className="text-xs text-gray-500">
                  {city.region}, {city.country}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && showSuggestions && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg p-4 text-center text-gray-500 border border-gray-200">
          Buscando ciudades...
        </div>
      )}

      {showSuggestions && !loading && inputValue.trim() && autocompleteCities?.length === 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg p-4 text-center text-gray-500 border border-gray-200">
          No se encontraron resultados
        </div>
      )}
    </div>
  );
};
