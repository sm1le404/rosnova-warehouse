import { CommonService } from '../../common/services/common.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from '../entities/settings.entity';
import { DispenserDeviceTypes } from '../../devices/enums/dispenser.enum';
import * as process from 'node:process';
import { BRKEY, decrypt } from '../../common/utility/key-worker';

@Injectable()
export class SettingsService
  extends CommonService<Settings>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {
    super();
  }

  async onApplicationBootstrap() {
    if (global.licenseAvailable) {
      const fd = await this.getRepository().findOne({
        where: {
          key: 'ld',
          value: Not(IsNull()),
        },
      });
      if (!fd) {
        const data = await this.settingsRepository.create({
          key: 'ld',
          value: `${Date.now().toString()}||${process.env.LICENSE_KEY}`,
        });
        await this.settingsRepository.save(data);
      } else {
        const kd = fd.value.split('||');
        if (kd[1] == process.env.LICENSE_KEY) {
          const dec = await decrypt(process.env.LICENSE_KEY ?? '', BRKEY);
          if (dec.bef < Number(kd[0]) || Date.now() < Number(kd[0])) {
            global.licenseAvailable = false;
          }
        } else {
          await this.setValue(
            'ld',
            `${Date.now().toString()}||${process.env.LICENSE_KEY}`,
          );
        }
      }
    }
  }

  getRepository(): Repository<Settings> {
    return this.settingsRepository;
  }

  async getValue(
    key: string,
  ): Promise<DispenserDeviceTypes | string | undefined> {
    const setting = await this.getRepository().findOne({
      where: {
        key,
      },
    });

    return setting?.value;
  }

  async setValue(
    key: string,
    value: any,
  ): Promise<DispenserDeviceTypes | string | undefined> {
    const setting = await this.getRepository().findOne({
      where: {
        key,
      },
    });

    if (setting) {
      setting.value = value;
      await this.settingsRepository.update(
        { id: setting.id },
        {
          value,
        },
      );
    }

    return setting?.value;
  }
}
