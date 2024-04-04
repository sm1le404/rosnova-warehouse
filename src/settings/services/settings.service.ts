import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from '../entities/settings.entity';
import { DispenserDeviceTypes } from '../../devices/enums/dispenser.enum';

@Injectable()
export class SettingsService extends CommonService<Settings> {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {
    super();
  }

  getRepository(): Repository<Settings> {
    return this.settingsRepository;
  }

  async getValue(key: string): Promise<DispenserDeviceTypes> {
    const setting = await this.getRepository().findOne({
      where: {
        key,
      },
    });
    return (
      (setting?.value as DispenserDeviceTypes) ?? DispenserDeviceTypes.TOPAZ
    );
  }
}
