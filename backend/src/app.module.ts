import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { WeatherModule } from '@modules/weather/weather.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('app.cache.ttl', 3600000),
      }),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(
          process.env.DATABASE_PORT || process.env.DB_PORT || '5432',
          10,
        ),
        username:
          process.env.DATABASE_USERNAME ||
          process.env.DB_USERNAME ||
          'postgres',
        password:
          process.env.DATABASE_PASSWORD ||
          process.env.DB_PASSWORD ||
          'postgres',
        database:
          process.env.DATABASE_NAME || process.env.DB_NAME || 'weather_app',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging:
          process.env.DATABASE_LOGGING === 'true' ||
          process.env.DB_LOGGING === 'true' ||
          true,
      }),
    }),
    UsersModule,
    AuthModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
