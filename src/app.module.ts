import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppLoggerMiddlewar } from './common/middlewares/app-logger.middlewar';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import AppDataSource from 'ormconfig';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: Number(process.env.CACHE_TIME ?? 3600),
    }),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return AppDataSource.options as TypeOrmModuleOptions;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return new DataSource(options);
      },
    }),
    WinstonModule.forRootAsync({
      useFactory: () => {
        const transportList = [];
        transportList.push(
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('Rosnova WH'),
            ),
          }),
        );
        return {
          transports: transportList,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddlewar).forRoutes('*');
  }
}
