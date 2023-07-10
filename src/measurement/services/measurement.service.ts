import { paginate } from 'nestjs-paginate';
import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from '../entities/measurement.entity';
import {
  PaginationMeasurement,
  PaginationMeasurementParams,
} from '../classes/pagination-measurement.params';
import { ResponseMeasurementDto } from '../dto/response-measurement.dto';

@Injectable()
export class MeasurementService extends CommonService<Measurement> {
  constructor(
    @InjectRepository(Measurement)
    private measurementRepository: Repository<Measurement>,
  ) {
    super();
  }

  getRepository(): Repository<Measurement> {
    return this.measurementRepository;
  }

  async findPagination(
    paginationPayload: PaginationMeasurement,
  ): Promise<ResponseMeasurementDto> {
    return paginate(paginationPayload, this.measurementRepository, {
      sortableColumns: PaginationMeasurementParams.sortableColumns,
      searchableColumns: PaginationMeasurementParams.searchableColumns,
      relations: PaginationMeasurementParams.relationList,
      filterableColumns: PaginationMeasurementParams.filterableColumns,
      defaultSortBy: PaginationMeasurementParams.defaultSortBy,
      maxLimit: PaginationMeasurementParams.maxLimit,
    });
  }
}
