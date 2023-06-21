import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispenser } from '../entities/dispenser.entity';

@Injectable()
export class DispenserService extends CommonService<Dispenser> {
  constructor(
    @InjectRepository(Dispenser)
    private dispenserRepository: Repository<Dispenser>,
  ) {
    super();
  }

  getRepository(): Repository<Dispenser> {
    return this.dispenserRepository;
  }
}
