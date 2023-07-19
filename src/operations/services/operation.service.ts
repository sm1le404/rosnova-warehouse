import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../entities/operation.entity';
import {
  PaginationOperation,
  PaginationOperationParams,
} from '../classes/pagination-operation.params';
import { ResponseOperationDto } from '../dto';
import { paginate } from 'nestjs-paginate';

@Injectable()
export class OperationService extends CommonService<Operation> {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {
    super();
  }

  getRepository(): Repository<Operation> {
    return this.operationRepository;
  }

  async findPagination(
    paginationPayload: PaginationOperation,
  ): Promise<ResponseOperationDto> {
    return paginate(paginationPayload, this.operationRepository, {
      sortableColumns: PaginationOperationParams.sortableColumns,
      searchableColumns: PaginationOperationParams.searchableColumns,
      relations: PaginationOperationParams.relationList,
      filterableColumns: PaginationOperationParams.filterableColumns,
      defaultSortBy: PaginationOperationParams.defaultSortBy,
      maxLimit: PaginationOperationParams.maxLimit,
    });
  }
}
