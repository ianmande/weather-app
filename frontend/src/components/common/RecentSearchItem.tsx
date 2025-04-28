import {useContext} from 'react';

import {Card, CardContent} from '@components/ui/card';

import {WeatherContext} from '@context/weatherContext';

import {WeatherResponse} from '@interfaces/weather';

interface Props {
  weatherData: WeatherResponse;
}

export const RecentSearchItem = ({weatherData}: Props) => {
  const {setWeatherData} = useContext(WeatherContext);

  return (
    <Card className="border-gray-200 shadow-sm cursor-pointer" onClick={() => setWeatherData(weatherData)}>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h4 className="font-medium">{weatherData.location.name}</h4>
          <p className="text-sm text-gray-500">
            {weatherData.current.temp_c}°C - {weatherData.current.condition.text}
          </p>
        </div>
        <img src={weatherData.current.condition.icon} alt={weatherData.location.name} className="w-10 h-10" />
      </CardContent>
    </Card>
  );
};
