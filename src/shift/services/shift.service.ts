import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Shift } from '../entities/shift.entity';

@Injectable()
export class ShiftService extends CommonService<Shift> {
  constructor(
    @InjectRepository(Shift)
    private fuelHolderRepository: Repository<Shift>,
  ) {
    super();
  }

  getRepository(): Repository<Shift> {
    return this.fuelHolderRepository;
  }
}
