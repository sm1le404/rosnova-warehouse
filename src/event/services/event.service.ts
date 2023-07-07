import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import {
  PaginationEvent,
  PaginationEventParams,
} from '../classes/pagination-event.params';
import { ResponseEventDto } from '../dto/response-event.dto';
import { paginate } from 'nestjs-paginate';

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

  async findPagination(
    paginationEventPayload: PaginationEvent,
  ): Promise<ResponseEventDto> {
    return paginate(paginationEventPayload, this.eventRepository, {
      sortableColumns: PaginationEventParams.sortableColumns,
      searchableColumns: PaginationEventParams.searchableColumns,
      relations: PaginationEventParams.relationList,
      filterableColumns: PaginationEventParams.filterableColumns,
      defaultSortBy: PaginationEventParams.defaultSortBy,
      maxLimit: PaginationEventParams.maxLimit,
    });
  }
}
