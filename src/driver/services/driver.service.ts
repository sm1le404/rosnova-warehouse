import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../entities/driver.entity';

@Injectable()
export class DriverService extends CommonService<Driver> {
  constructor(
    @InjectRepository(Driver) private driverRepository: Repository<Driver>,
  ) {
    super();
  }

  getRepository(): Repository<Driver> {
    return this.driverRepository;
  }
}
