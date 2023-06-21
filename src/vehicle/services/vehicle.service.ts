import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehicleService extends CommonService<Vehicle> {
  constructor(
    @InjectRepository(Vehicle)
    private fuelHolderRepository: Repository<Vehicle>,
  ) {
    super();
  }

  getRepository(): Repository<Vehicle> {
    return this.fuelHolderRepository;
  }
}
