import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DeviceTankService } from '../../devices/services/device.tank.service';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';

@Injectable()
export class CronService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private readonly deviceTankService: DeviceTankService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'testRead',
  })
  async clearOtpRecords() {
    try {
      await this.deviceTankService.start();
      await this.deviceTankService.readCommand();
    } catch (e) {
      this.logger.error(e);
    }
  }
}
