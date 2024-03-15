import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SchedulerRegistry } from '@nestjs/schedule';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CronJob } from 'cron';

@Injectable()
export class InteractiveScheduleCronService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  deleteCronJob(cronJobName: string): void {
    try {
      this.schedulerRegistry.deleteCronJob(cronJobName);
    } catch (e) {}
  }

  async upsertCronJob(
    cronJobName: string,
    cronJobTime: string,
    funcToExecute: Function,
  ): Promise<void> {
    this.deleteCronJob(cronJobName);
    const job = new CronJob(cronJobTime, async () => {
      try {
        await funcToExecute();
      } catch (e) {
        this.logger.error(e);
      }
    });
    this.schedulerRegistry.addCronJob(cronJobName, job);
    job.start();
  }
}
