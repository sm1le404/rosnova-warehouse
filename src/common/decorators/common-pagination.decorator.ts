import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { FilterableColumns } from '../types/filterable-columns';
import { Column } from 'nestjs-paginate/lib/helper';

export function CommonPagination(
  filterColumns: FilterableColumns<any> = {},
  searchColumns: Column<any>[] = [],
  sortColumns: Column<any>[] = [],
) {
  return applyDecorators(
    ApiQuery({
      name: 'filter',
      required: false,
      description: `Filter using operators ($eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw), 
        simple without param like $eq, 
        available fields: ${JSON.stringify(filterColumns)}`,
      example: '$in:Test, tost',
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      description: `Sort by field: ${sortColumns.join(',')} use ASC or DESC`,
      example: 'id:DESC',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'positive number from 1 to ထ',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'items limit on page',
      example: 20,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Search by query string',
    }),
    ApiQuery({
      name: 'searchBy',
      required: false,
      description: `Search in fields: ${searchColumns.join(',')}`,
    }),
  );
}
