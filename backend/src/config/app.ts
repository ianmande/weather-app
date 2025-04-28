import { registerAs } from '@nestjs/config';

import { readFileSync } from 'fs';
import path from 'path';

interface PackageJson {
  name: string;
  description: string;
  version: string;
}

const packageJson = JSON.parse(
  readFileSync(path.join(__dirname, '../../', 'package.json'), 'utf8'),
) as PackageJson;

export const appConfig = {
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version,
};

export default registerAs('app', () => ({
  weatherApi: {
    apiKey: process.env.WEATHER_API_KEY || '',
    baseUrl: process.env.WEATHER_API_URL || 'https://api.weatherapi.com/v1',
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600000', 10),
  },
}));
