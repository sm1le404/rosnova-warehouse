import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrier } from '../entities/carrier.entity';

@Injectable()
export class CarrierService extends CommonService<Carrier> {
  constructor(
    @InjectRepository(Carrier)
    private carrierRepository: Repository<Carrier>,
  ) {
    super();
  }

  getRepository(): Repository<Carrier> {
    return this.carrierRepository;
  }
}
