import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventService extends CommonService<Event> {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ) {
    super();
  }

  getRepository(): Repository<Event> {
    return this.eventRepository;
  }
}
