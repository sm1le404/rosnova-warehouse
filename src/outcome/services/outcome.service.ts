import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Outcome } from '../entities/outcome.entity';
import {
  PaginationOutcome,
  PaginationOutcomeParams,
} from '../classes/pagination-outcome.params';
import { ResponseOutcomeDto } from '../dto';
import { paginate } from 'nestjs-paginate';

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

  async findPagination(
    paginationPayload: PaginationOutcome,
  ): Promise<ResponseOutcomeDto> {
    return paginate(paginationPayload, this.outcomeRepository, {
      sortableColumns: PaginationOutcomeParams.sortableColumns,
      searchableColumns: PaginationOutcomeParams.searchableColumns,
      relations: PaginationOutcomeParams.relationList,
      filterableColumns: PaginationOutcomeParams.filterableColumns,
      defaultSortBy: PaginationOutcomeParams.defaultSortBy,
      maxLimit: PaginationOutcomeParams.maxLimit,
    });
  }
}
