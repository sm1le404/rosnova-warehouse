/**
 * @author: CHIKIRIAY
 * @created: 3/16/23
 * @Time: 7:54 PM
 */

import { PaginatedParams } from '../classes/paginated-params';

import { BaseEntity } from 'typeorm';
import { CommonEntity } from '../entities/common.entity';

/**
 * Add or Change
 * order by active to DESC
 * true, true, ..., false
 * * * * * * * * * * * * *
 * Add to sortable columns
 * (sortableColumns: ['active',...])
 * @param paginateQuery
 */
export const addSortByActiveToPaginate = <
  T extends (BaseEntity | CommonEntity) & { active?: boolean },
>(
  paginateQuery: PaginatedParams<T>,
): void => {
  if (!paginateQuery.sortBy) {
    paginateQuery.sortBy = [];
  }
  paginateQuery.sortBy = paginateQuery.sortBy.filter(
    ([key]) => key !== 'active',
  );
  paginateQuery.sortBy.unshift(['active', 'DESC']);
};
