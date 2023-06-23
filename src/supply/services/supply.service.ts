import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Supply } from '../entities/supply.entity';
import {
  PaginationSupply,
  PaginationSupplyParams,
} from '../classes/pagination-supply.params';
import { ResponseSupplyDto } from '../dto';
import { paginate } from 'nestjs-paginate';

@Injectable()
export class SupplyService extends CommonService<Supply> {
  constructor(
    @InjectRepository(Supply)
    private supplyRepository: Repository<Supply>,
  ) {
    super();
  }

  getRepository(): Repository<Supply> {
    return this.supplyRepository;
  }

  async findPagination(
    paginationPayload: PaginationSupply,
  ): Promise<ResponseSupplyDto> {
    return paginate(paginationPayload, this.supplyRepository, {
      sortableColumns: PaginationSupplyParams.sortableColumns,
      searchableColumns: PaginationSupplyParams.searchableColumns,
      relations: PaginationSupplyParams.relationList,
      filterableColumns: PaginationSupplyParams.filterableColumns,
      defaultSortBy: PaginationSupplyParams.defaultSortBy,
      maxLimit: PaginationSupplyParams.maxLimit,
    });
  }
}
