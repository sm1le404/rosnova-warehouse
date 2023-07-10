import { FilterOperator } from 'nestjs-paginate/lib/paginate';
import { PaginatedParams } from '../../common/classes/paginated-params';
import { Shift } from '../entities/shift.entity';

export class PaginationShift extends PaginatedParams<Shift> {}

export const PaginationShiftParams = new PaginationShift();

PaginationShiftParams.selectedColumns = [];
PaginationShiftParams.searchableColumns = ['createdAt', 'closedAt'];
PaginationShiftParams.sortableColumns = ['id', 'createdAt', 'updatedAt'];
PaginationShiftParams.relationList = ['event', 'outcome', 'supply', 'user'];

PaginationShiftParams.filterableColumns = {
  id: [FilterOperator.IN, FilterOperator.EQ],
  createdAt: [FilterOperator.GTE, FilterOperator.LTE],
  event: [FilterOperator.IN, FilterOperator.EQ],
  outcome: [FilterOperator.IN, FilterOperator.EQ],
  supply: [FilterOperator.IN, FilterOperator.EQ],
  user: [FilterOperator.IN, FilterOperator.EQ],
};
