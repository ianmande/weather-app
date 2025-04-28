import {Progress} from '@radix-ui/react-progress';
import {Clock, Droplets, Heart, Sun, Thermometer, Wind} from 'lucide-react';

import {WeatherItem} from '@components/common/WatherItem';
import {Button} from '@components/ui/button';
import {Card, CardContent} from '@components/ui/card';

import {useFavorites} from '@hooks/useFavorites';

import {WeatherResponse} from '@interfaces/weather';

type Props = {
  weatherData: WeatherResponse | null;
  loading: boolean;
};

export const CurrentCityWeather = ({weatherData, loading}: Props) => {
  const {isFavorite, addToFavorites, removeFromFavorites, loading: loadingFavorites} = useFavorites();

  if (loading) {
    return (
      <div className="w-full py-6 flex justify-center">
        <Progress className="w-full max-w-md" />
      </div>
    );
  }

  if (!weatherData) {
    return <div className="w-full text-center py-8 text-gray-500">Busca una ciudad para ver el clima actual</div>;
  }

  const hasFavorite = isFavorite(weatherData?.location.name);

  const handleFavorite = () => {
    if (hasFavorite) {
      removeFromFavorites(weatherData?.location.name);
    } else {
      addToFavorites({
        city: weatherData?.location.name,
        country: weatherData?.location.country,
        region: weatherData?.location.region,
        cityKey: `${weatherData?.location.name},${weatherData?.location.country}`,
      });
    }
  };

  return (
    <Card className="mb-8 border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">
                {weatherData.location.name}, {weatherData.location.country}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                className="h-6 w-6 text-gray-400 hover:text-red-500 cursor-pointer"
                disabled={loadingFavorites}
              >
                <Heart className="h-5 w-5" fill={hasFavorite ? 'red' : 'none'} />
              </Button>
            </div>
            <p className="text-sm text-gray-500">{weatherData.location.localtime.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold">{weatherData.current.temp_c}°C</span>
            <div className="flex flex-col items-end">
              <img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} />
              <span className="text-sm text-gray-500">{weatherData.current.condition.text}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <WeatherItem icon={Thermometer} label="Sensación" value={`${weatherData.current.feelslike_f}°F`} />
          <WeatherItem icon={Wind} label="Viento" value={`${weatherData.current.wind_kph} km/h`} />
          <WeatherItem icon={Droplets} label="Humedad" value={`${weatherData.current.humidity}%`} />
          <WeatherItem icon={Sun} label="UV" value={`${weatherData.current.uv}`} />
          <WeatherItem icon={Clock} label="Actualizado" value={weatherData.current.last_updated.split(' ')[1]} />
          <WeatherItem
            icon={() => <span className="text-blue-500 font-bold text-xs">hPa</span>}
            label="Presión"
            value={`${weatherData.current.pressure_mb} mb`}
          />
        </div>
      </CardContent>
    </Card>
  );
};
