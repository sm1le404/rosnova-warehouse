import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Refinery } from '../entities/refinery.entity';

@Injectable()
export class RefineryService extends CommonService<Refinery> {
  constructor(
    @InjectRepository(Refinery)
    private refineryRepository: Repository<Refinery>,
  ) {
    super();
  }

  getRepository(): Repository<Refinery> {
    return this.refineryRepository;
  }
}
