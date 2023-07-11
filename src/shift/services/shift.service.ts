import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Shift } from '../entities/shift.entity';
import {
  PaginationShift,
  PaginationShiftParams,
} from '../classes/pagination-shift.params';
import { ResponseShiftDto } from '../dto/response-shift.dto';
import { paginate } from 'nestjs-paginate';

@Injectable()
export class ShiftService extends CommonService<Shift> {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
  ) {
    super();
  }

  getRepository(): Repository<Shift> {
    return this.shiftRepository;
  }

  async findPagination(
    paginationPayload: PaginationShift,
  ): Promise<ResponseShiftDto> {
    return paginate(paginationPayload, this.shiftRepository, {
      sortableColumns: PaginationShiftParams.sortableColumns,
      searchableColumns: PaginationShiftParams.searchableColumns,
      relations: PaginationShiftParams.relationList,
      filterableColumns: PaginationShiftParams.filterableColumns,
      defaultSortBy: PaginationShiftParams.defaultSortBy,
      maxLimit: PaginationShiftParams.maxLimit,
    });
  }

  async getLastShift(userId: number): Promise<Shift> {
    return this.shiftRepository.findOne({
      where: { user: { id: userId }, closedAt: IsNull() },
      order: { id: 'DESC' },
    });
  }
}
