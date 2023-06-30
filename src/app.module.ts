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
import AppDataSource from './ormconfig';
import { DataSource } from 'typeorm';
import { DriverModule } from './driver/driver.module';
import { MeasurementModule } from './measurement/measurement.module';
import { FuelHolderModule } from './fuel-holder/fuel-holder.module';
import { UserModule } from './user/user.module';
import { FuelModule } from './fuel/fuel.module';
import { DispenserModule } from './dispenser/dispenser.module';
import { RefineryModule } from './refinery/refinery.module';
import { TankModule } from './tank/tank.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { SupplyModule } from './supply/supply.module';
import { OutcomeModule } from './outcome/outcome.module';
import { ShiftModule } from './shift/shift.module';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import path from 'path';
import { rootpath } from './common/utility/rootpath';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', path.join(rootpath(), '.env')],
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
        if (!!process.env.DEV) {
          transportList.push(
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike('Rosnova WH'),
              ),
            }),
          );
        } else {
          transportList.push(
            new winston.transports.Console({
              level: 'error',
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike('Rosnova WH'),
              ),
            }),
            new winston.transports.File({
              filename: path.join(rootpath(), `logs`, `errors.log`),
              level: 'error',
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
            }),
          );
        }

        return {
          transports: transportList,
        };
      },
    }),
    DriverModule,
    VehicleModule,
    TankModule,
    RefineryModule,
    DispenserModule,
    FuelModule,
    UserModule,
    FuelHolderModule,
    MeasurementModule,
    SupplyModule,
    OutcomeModule,
    ShiftModule,
    EventModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddlewar).forRoutes('*');
  }
}
