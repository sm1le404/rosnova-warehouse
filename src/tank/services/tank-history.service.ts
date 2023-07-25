import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TankHistory } from '../entities/tank-history.entity';

@Injectable()
export class TankHistoryService extends CommonService<TankHistory> {
  constructor(
    @InjectRepository(TankHistory)
    private tankHistoryRepository: Repository<TankHistory>,
  ) {
    super();
  }

  getRepository(): Repository<TankHistory> {
    return this.tankHistoryRepository;
  }
}
