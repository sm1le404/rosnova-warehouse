import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Trailer } from '../entities/trailer.entity';

@Injectable()
export class TrailerService extends CommonService<Trailer> {
  constructor(
    @InjectRepository(Trailer)
    private trailerRepository: Repository<Trailer>,
  ) {
    super();
  }

  getRepository(): Repository<Trailer> {
    return this.trailerRepository;
  }
}
