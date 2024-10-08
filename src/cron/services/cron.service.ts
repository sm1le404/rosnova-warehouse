import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';
import { ConfigService } from '@nestjs/config';
import { TankService } from '../../tank/services/tank.service';
import { KafkaService } from '../../kafka/services';
import { OperationService } from '../../operations/services/operation.service';
import { EventService } from '../../event/services/event.service';
import { LessThan } from 'typeorm';
import {
  DeviceDispenserService,
  DeviceTankService,
} from '../../devices/services';

@Injectable()
export class CronService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private readonly deviceTankService: DeviceTankService,
    private readonly deviceDispenserService: DeviceDispenserService,
    private readonly configService: ConfigService,
    private readonly tankService: TankService,
    private readonly kafkaService: KafkaService,
    private readonly operationService: OperationService,
    private readonly eventService: EventService,
  ) {}

  isDev(): boolean {
    return (
      !!this.configService.get('DEV') &&
      this.configService.get('DEV') !== 'false'
    );
  }

  @Cron(CronExpression.EVERY_SECOND, {
    name: 'readTankState',
  })
  async readTankState() {
    if (this.isDev()) {
      return;
    }
    try {
      await this.deviceTankService.start();
      await this.deviceTankService.readTanks();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'initDispenser',
  })
  async initDispenser() {
    if (this.isDev()) {
      return;
    }
    try {
      await this.deviceDispenserService.start();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'updateDispenserStatuses',
  })
  async updateDispenserStatuses() {
    if (this.isDev()) {
      return;
    }
    try {
      await this.deviceDispenserService.updateDispenserStatuses();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'sendTankData',
  })
  async sendTankData() {
    if (this.isDev()) {
      return;
    }
    try {
      await this.tankService.sendToStatistic();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'checkProgressOperation',
  })
  async checkProgressOperation() {
    if (this.isDev()) {
      return;
    }
    try {
      await this.operationService.fixProgressOperations();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'checkKafkaState',
  })
  async checkKafkaState() {
    if (this.isDev()) {
      return;
    }
    try {
      await this.kafkaService.initService();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'sendKafkaQueue',
  })
  async sendKafkaQueue() {
    if (this.isDev()) {
      return;
    }
    try {
      await this.kafkaService.executeSender();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'sendTankDataToHub',
  })
  async sendTankDataToHub() {
    if (this.isDev()) {
      return;
    }
    try {
      await this.tankService.sendToHubStatistic();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS, {
    name: 'clearEventTable',
  })
  async clearEventTable() {
    if (this.isDev()) {
      return;
    }
    try {
      const day = new Date();
      day.setHours(day.getHours() - 24 * 30);
      await this.eventService.deleteMany({
        where: {
          createdAt: LessThan(Math.floor(day.getTime() / 1000)),
        },
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
