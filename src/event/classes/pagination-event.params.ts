import { FilterOperator } from 'nestjs-paginate/lib/paginate';
import { PaginatedParams } from '../../common/classes/paginated-params';
import { Event } from '../entities/event.entity';

export class PaginationEvent extends PaginatedParams<Event> {}

export const PaginationEventParams = new PaginationEvent();

PaginationEventParams.selectedColumns = [];
PaginationEventParams.searchableColumns = ['name', 'dataBefore', 'dataAfter'];
PaginationEventParams.sortableColumns = ['id', 'createdAt', 'updatedAt'];
PaginationEventParams.relationList = ['shift', 'user'];

PaginationEventParams.filterableColumns = {
  id: [FilterOperator.IN, FilterOperator.EQ],
  createdAt: [FilterOperator.GTE, FilterOperator.LTE],
  shift: [FilterOperator.IN, FilterOperator.EQ],
  user: [FilterOperator.IN, FilterOperator.EQ],
  type: [FilterOperator.IN, FilterOperator.EQ],
  collection: [FilterOperator.IN, FilterOperator.EQ],
};
