import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Outcome } from '../entities/outcome.entity';

@Injectable()
export class OutcomeService extends CommonService<Outcome> {
  constructor(
    @InjectRepository(Outcome)
    private outcomeRepository: Repository<Outcome>,
  ) {
    super();
  }

  getRepository(): Repository<Outcome> {
    return this.outcomeRepository;
  }
}
