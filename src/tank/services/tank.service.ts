import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tank } from '../entities/tank.entity';

@Injectable()
export class TankService extends CommonService<Tank> {
  constructor(
    @InjectRepository(Tank)
    private fuelHolderRepository: Repository<Tank>,
  ) {
    super();
  }

  getRepository(): Repository<Tank> {
    return this.fuelHolderRepository;
  }
}
