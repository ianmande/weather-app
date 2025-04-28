import {useContext, useEffect, useState} from 'react';

import {Progress} from '@radix-ui/react-progress';
import {Trash2} from 'lucide-react';

import {Button} from '@components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@components/ui/table';

import {useFavorites} from '@hooks/useFavorites';

import {WeatherContext} from '@context/weatherContext';

import {FavoriteCity, WeatherResponse} from '@interfaces/weather';

import {getWeather} from '@services/endpoints/weather';

const FavoriteItem = ({
  favorite,
  removeFavorite,
}: {
  favorite: FavoriteCity;
  removeFavorite: (cityKey: string) => void;
}) => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const {setWeatherData} = useContext(WeatherContext);

  useEffect(() => {
    const fetchWeather = async () => {
      console.log('fetchWeather', favorite.city);
      const response = await getWeather(favorite.city);
      setWeather(response.data);
    };

    fetchWeather();
  }, [favorite.city]);

  if (!weather) return null;

  return (
    <TableRow className="cursor-pointer" onClick={() => setWeatherData(weather)}>
      <TableCell className="font-medium">{weather.location.name}</TableCell>
      <TableCell>{weather.current.temp_c}°C</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <img className="h-10 w-10" src={weather.current.condition.icon} alt="weather" />
          <span>{weather.current.condition.text}</span>
        </div>
      </TableCell>
      <TableCell>{weather.location.localtime}</TableCell>
      <TableCell>
        <Button
          variant="destructive"
          className="cursor-pointe"
          size="sm"
          onClick={() => removeFavorite(favorite.cityKey)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const Favorites = () => {
  const {favorites, removeFromFavorites, loadFavorites, loading} = useFavorites();

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <div className="w-full py-6 flex justify-center">
        <Progress className="w-full max-w-md" />
      </div>
    );

  if (favorites.length === 0) return null;

  console.log({favorites});

  return (
    <section>
      <h3 className="text-lg font-bold mb-4">Ciudades Favoritas</h3>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="px-5">
            <TableRow>
              <TableHead>Ciudad</TableHead>
              <TableHead>Temperatura</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Hora Local</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {favorites.map((favorite) => (
              <FavoriteItem key={favorite.cityKey} favorite={favorite} removeFavorite={removeFromFavorites} />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
