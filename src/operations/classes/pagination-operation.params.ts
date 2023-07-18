import { FilterOperator } from 'nestjs-paginate/lib/paginate';
import { PaginatedParams } from '../../common/classes/paginated-params';
import { Operation } from '../entities/operation.entity';

export class PaginationOperation extends PaginatedParams<Operation> {}

export const PaginationOperationParams = new PaginationOperation();

PaginationOperationParams.selectedColumns = [];
PaginationOperationParams.searchableColumns = ['numberTTN'];
PaginationOperationParams.sortableColumns = ['id', 'createdAt', 'updatedAt'];
PaginationOperationParams.relationList = [
  'dispenser',
  'driver',
  'shift',
  'tank',
  'vehicle',
];

PaginationOperationParams.filterableColumns = {
  id: [FilterOperator.IN, FilterOperator.EQ],
  createdAt: [FilterOperator.GTE, FilterOperator.LTE],
  dispenser: [FilterOperator.IN, FilterOperator.EQ],
  driver: [FilterOperator.IN, FilterOperator.EQ],
  fuel: [FilterOperator.IN, FilterOperator.EQ],
  fuelHolder: [FilterOperator.IN, FilterOperator.EQ],
  shift: [FilterOperator.IN, FilterOperator.EQ],
  tank: [FilterOperator.IN, FilterOperator.EQ],
  vehicle: [FilterOperator.IN, FilterOperator.EQ],
  status: [FilterOperator.IN, FilterOperator.EQ],
  type: [FilterOperator.IN, FilterOperator.EQ],
};
