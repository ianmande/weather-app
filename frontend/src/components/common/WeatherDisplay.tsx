import {Card} from '@components/ui/card';

import {WeatherResponse} from '@interfaces/weather';

interface WeatherDisplayProps {
  weatherData: WeatherResponse | null;
  loading: boolean;
}

export const WeatherDisplay = ({weatherData, loading}: WeatherDisplayProps) => {
  if (loading) {
    return (
      <Card className="p-6 w-full max-w-md mx-auto">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Cargando datos del clima...</p>
        </div>
      </Card>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">{weatherData.location.name}</h2>
        <p className="text-gray-500 mb-4">{weatherData.location.country}</p>

        <div className="flex items-center justify-center mb-4">
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
            className="w-24 h-24"
          />
          <div className="ml-4">
            <p className="text-4xl font-bold">{weatherData.current.temp_c}°C</p>
            <p className="text-gray-600">{weatherData.current.condition.text}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <p className="text-gray-500">Sensación</p>
            <p className="font-semibold">{weatherData.current.feelslike_c}°C</p>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <p className="text-gray-500">Humedad</p>
            <p className="font-semibold">{weatherData.current.humidity}%</p>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <p className="text-gray-500">Viento</p>
            <p className="font-semibold">{weatherData.current.wind_kph} km/h</p>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <p className="text-gray-500">Presión</p>
            <p className="font-semibold">{weatherData.current.pressure_mb} mb</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
