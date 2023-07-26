import { FilterOperator } from 'nestjs-paginate/lib/paginate';
import { PaginatedParams } from '../../common/classes/paginated-params';
import { TankHistory } from '../entities/tank-history.entity';

export class PaginationTankHistory extends PaginatedParams<TankHistory> {}

export const PaginationTankHistoryParams = new PaginationTankHistory();

PaginationTankHistoryParams.selectedColumns = [];
PaginationTankHistoryParams.searchableColumns = [];
PaginationTankHistoryParams.sortableColumns = ['id', 'createdAt', 'updatedAt'];
PaginationTankHistoryParams.relationList = ['fuel', 'fuelHolder', 'refinery'];

PaginationTankHistoryParams.filterableColumns = {
  id: [FilterOperator.IN, FilterOperator.EQ],
  createdAt: [FilterOperator.GTE, FilterOperator.LTE],
  fuel: [FilterOperator.IN, FilterOperator.EQ],
  fuelHolder: [FilterOperator.IN, FilterOperator.EQ],
  refinery: [FilterOperator.IN, FilterOperator.EQ],
};
