import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dock } from '../entities/dock.entity';

@Injectable()
export class DockService extends CommonService<Dock> {
  constructor(
    @InjectRepository(Dock)
    private dockRepository: Repository<Dock>,
  ) {
    super();
  }

  getRepository(): Repository<Dock> {
    return this.dockRepository;
  }
}
