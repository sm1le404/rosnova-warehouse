import { CommonService } from '../../common/services/common.service';
import { Fuel } from '../entities/fuel.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FuelService extends CommonService<Fuel> {
  constructor(
    @InjectRepository(Fuel) private fuelRepository: Repository<Fuel>,
  ) {
    super();
  }

  getRepository(): Repository<Fuel> {
    return this.fuelRepository;
  }
}
