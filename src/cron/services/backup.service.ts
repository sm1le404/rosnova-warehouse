import {
  Inject,
  Injectable,
  LoggerService,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InteractiveScheduleCronService } from './interactive.schedule.cron.service';
import { isDev } from '../../common/utility';
import path from 'path';
import { rootpath } from '../../common/utility/rootpath';
// eslint-disable-next-line import/no-extraneous-dependencies
import JSZip from 'jszip';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Client } from 'basic-ftp';
import * as fs from 'fs';
import { rimraf } from 'rimraf';

@Injectable()
export class BackupService implements OnApplicationBootstrap {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private interactiveScheduleCronService: InteractiveScheduleCronService,
  ) {}

  async onApplicationBootstrap() {
    try {
      if (process.env.BACKUP_HOURS && process.env.FTP_HOST) {
        await this.interactiveScheduleCronService.upsertCronJob(
          `backup`,
          `0 0-23/${parseInt(process.env.BACKUP_HOURS) ?? 1} * * *`,
          () => {
            const dbPath = isDev()
              ? path.join(process.env.PWD, process.env.DB_NAME)
              : path.join(rootpath(), process.env.DB_NAME);

            const zip = new JSZip();
            const dbData = fs.readFileSync(dbPath);
            const fileSaved = zip.file(process.env.DB_NAME, dbData);
            if (fileSaved) {
              const backupName = `backup_${
                process.env.DB_NAME
              }_${new Date().toISOString()}.zip`;

              const fileData = fs.createWriteStream(backupName);
              fileData.on('error', (error) => {
                this.logger.error(error);
              });

              zip
                .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                .pipe(fileData)
                .on('finish', async () => {
                  if (fs.existsSync(backupName)) {
                    const client = new Client();
                    await client.access({
                      host: `${process.env.FTP_HOST}`,
                      user: `${process.env.FTP_USER}`,
                      password: `${process.env.FTP_PWD}`,
                      secure: !!process.env.FTP_SECURE,
                    });
                    client
                      .uploadFrom(
                        backupName,
                        `${process.env.FTP_PATH}/${backupName}`,
                      )
                      .finally(() => {
                        rimraf(backupName);
                        client.close();
                      })
                      .catch((error) => this.logger.error(error));
                  }
                });
            }
          },
        );
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
