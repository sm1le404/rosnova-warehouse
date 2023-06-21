import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Supply } from '../entities/supply.entity';

@Injectable()
export class SupplyService extends CommonService<Supply> {
  constructor(
    @InjectRepository(Supply)
    private supplyRepository: Repository<Supply>,
  ) {
    super();
  }

  getRepository(): Repository<Supply> {
    return this.supplyRepository;
  }
}
