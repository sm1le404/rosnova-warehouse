import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelHolder } from '../entities/fuel-holder.entity';

@Injectable()
export class FuelHolderService extends CommonService<FuelHolder> {
  constructor(
    @InjectRepository(FuelHolder)
    private fuelHolderRepository: Repository<FuelHolder>,
  ) {
    super();
  }

  getRepository(): Repository<FuelHolder> {
    return this.fuelHolderRepository;
  }
}
