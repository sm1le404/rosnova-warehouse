import { FilterOperator } from 'nestjs-paginate/lib/paginate';
import { PaginatedParams } from '../../common/classes/paginated-params';
import { Supply } from '../entities/supply.entity';

export class PaginationSupply extends PaginatedParams<Supply> {}

export const PaginationSupplyParams = new PaginationSupply();

PaginationSupplyParams.selectedColumns = [];
PaginationSupplyParams.searchableColumns = ['numberTTN', 'driver'];
PaginationSupplyParams.sortableColumns = ['id', 'createdAt', 'updatedAt'];
PaginationSupplyParams.relationList = [
  'fuel',
  'fuelHolder',
  'refinery',
  'shift',
  'tank',
  'vehicle',
];

PaginationSupplyParams.filterableColumns = {
  id: [FilterOperator.IN, FilterOperator.EQ],
  createdAt: [FilterOperator.GTE, FilterOperator.LTE],
  fuel: [FilterOperator.IN, FilterOperator.EQ],
  fuelHolder: [FilterOperator.IN, FilterOperator.EQ],
  refinery: [FilterOperator.IN, FilterOperator.EQ],
  shift: [FilterOperator.IN, FilterOperator.EQ],
  tank: [FilterOperator.IN, FilterOperator.EQ],
  vehicle: [FilterOperator.IN, FilterOperator.EQ],
  type: [FilterOperator.IN, FilterOperator.EQ],
};
