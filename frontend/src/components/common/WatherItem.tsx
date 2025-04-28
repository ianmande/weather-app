import {ComponentType} from 'react';

interface Props {
  icon: ComponentType<{className: string}>;
  value: string;
  label: string;
}

export const WeatherItem = ({icon: Icon, value, label}: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-blue-500" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};
