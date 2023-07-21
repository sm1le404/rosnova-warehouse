import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Calibration } from '../entities/calibration.entity';

@Injectable()
export class CalibrationService extends CommonService<Calibration> {
  constructor(
    @InjectRepository(Calibration)
    private calibrationRepository: Repository<Calibration>,
  ) {
    super();
  }

  getRepository(): Repository<Calibration> {
    return this.calibrationRepository;
  }
}
