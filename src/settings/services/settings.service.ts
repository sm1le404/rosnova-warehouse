import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from '../entities/settings.entity';

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
}
