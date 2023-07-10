import { FilterOperator } from 'nestjs-paginate/lib/paginate';
import { PaginatedParams } from '../../common/classes/paginated-params';
import { Measurement } from '../entities/measurement.entity';

export class PaginationMeasurement extends PaginatedParams<Measurement> {}

export const PaginationMeasurementParams = new PaginationMeasurement();

PaginationMeasurementParams.selectedColumns = [];
PaginationMeasurementParams.searchableColumns = ['shift'];
PaginationMeasurementParams.sortableColumns = ['id', 'createdAt', 'updatedAt'];
PaginationMeasurementParams.relationList = ['shift', 'tank'];

PaginationMeasurementParams.filterableColumns = {
  id: [FilterOperator.IN, FilterOperator.EQ],
  createdAt: [FilterOperator.GTE, FilterOperator.LTE],
  shift: [FilterOperator.IN, FilterOperator.EQ],
  tank: [FilterOperator.IN, FilterOperator.EQ],
};
