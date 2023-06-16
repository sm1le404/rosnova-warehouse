import { Column, SortBy } from 'nestjs-paginate/lib/helper';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMeta<T> {
  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  sortBy: SortBy<T>;

  @ApiProperty()
  searchBy: Column<T>[];

  @ApiProperty()
  search: string;

  @ApiProperty()
  filter?: {
    [column: string]: string | string[];
  };
}
