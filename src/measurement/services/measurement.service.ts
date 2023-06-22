import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from '../entities/measurement.entity';

@Injectable()
export class MeasurementService extends CommonService<Measurement> {
  constructor(
    @InjectRepository(Measurement)
    private measurementRepository: Repository<Measurement>,
  ) {
    super();
  }

  getRepository(): Repository<Measurement> {
    return this.measurementRepository;
  }
}
