import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { AppLoggerMiddlewar } from './common/middlewares/app-logger.middlewar';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import 'winston-daily-rotate-file';
import * as winston from 'winston';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import AppDataSource from './ormconfig';
import { DataSource } from 'typeorm';
import { DriverModule } from './driver/driver.module';
import { KafkaModule } from './kafka/kafka.module';
import { MeasurementModule } from './measurement/measurement.module';
import { FuelHolderModule } from './fuel-holder/fuel-holder.module';
import { UserModule } from './user/user.module';
import { FuelModule } from './fuel/fuel.module';
import { DispenserModule } from './dispenser/dispenser.module';
import { RefineryModule } from './refinery/refinery.module';
import { TankModule } from './tank/tank.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { OperationModule } from './operations/operation.module';
import { ShiftModule } from './shift/shift.module';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import * as path from 'path';
import { rootpath } from './common/utility/rootpath';
import { DevicesModule } from './devices/devices.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportModule } from './report/report.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SettingsModule } from './settings/settings.module';
import { WsModule } from './ws/ws.module';
import { I18nModule } from 'nestjs-i18n';
import { isDev } from './common/utility';
import { APP_STARTED_MESS } from './front/updater.conf';
import { ShutdownObserver } from './common/services/shutdown.observer';
import { SwaggerService } from './common/services/swagger.service';
import { AppController } from './app.controller';
import { getMotherBoardCode } from './common/utility/seiral.num';
import { decrypt, BRKEY } from './common/utility/key-worker';
import { HasKeyGuard } from './common/guard/has-key.guard';
import { APP_GUARD } from '@nestjs/core';
import * as process from 'node:process';
import { DockModule } from './dock/dock.module';
import { CarrierModule } from './carrier/carrier.module';
import { AppService } from './app.service';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'ru',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    KafkaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [path.join(rootpath(), '.env'), '.env'],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 86400 * 1000,
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
        if (isDev()) {
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
            new winston.transports.DailyRotateFile({
              filename: path.join(rootpath(), `logs`, `%DATE%-errors.log`),
              datePattern: 'YYYY-MM-DD',
              level: 'error',
              format: winston.format.combine(
                winston.format.prettyPrint(),
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.align(),
                winston.format.printf((info) => {
                  console.log(info);
                  return `[${info.timestamp}] [${info.level}]: ${info.stack}`;
                }),
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
    OperationModule,
    ShiftModule,
    EventModule,
    AuthModule,
    DevicesModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    CronModule,
    ReportModule,
    DockModule,
    CarrierModule,
    SettingsModule,
    WsModule,
  ],
  controllers: [AppController],
  providers: [
    ShutdownObserver,
    SwaggerService,
    { useClass: HasKeyGuard, provide: APP_GUARD },
    AppService,
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddlewar).forRoutes('*');
  }

  async onModuleInit() {
    console.log(APP_STARTED_MESS);

    global.licenseAvailable = false;

    try {
      const mbcode = await getMotherBoardCode();
      const dec = await decrypt(process.env.LICENSE_KEY ?? '', BRKEY);
      if (mbcode == dec.mbcode && dec.bef > Date.now()) {
        global.licenseAvailable = true;
      }
    } catch (e) {}
  }
}
