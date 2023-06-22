import { FilterOperator } from 'nestjs-paginate/lib/paginate';
import { PaginatedParams } from '../../common/classes/paginated-params';
import { Outcome } from '../entities/outcome.entity';

export class PaginationOutcome extends PaginatedParams<Outcome> {}

export const PaginationOutcomeParams = new PaginationOutcome();

PaginationOutcomeParams.selectedColumns = [];
PaginationOutcomeParams.searchableColumns = ['numberTTN'];
PaginationOutcomeParams.sortableColumns = ['id', 'createdAt', 'updatedAt'];
PaginationOutcomeParams.relationList = [
  'dispenser',
  'driver',
  'fuel',
  'fuelHolder',
  'shift',
  'tank',
  'vehicle',
];

PaginationOutcomeParams.filterableColumns = {
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
};
