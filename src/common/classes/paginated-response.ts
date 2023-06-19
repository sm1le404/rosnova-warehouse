import { Paginated } from 'nestjs-paginate';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedLinks } from './paginated-links';
import { PaginatedMeta } from './paginated-meta';

export class PaginatedResponse<T> extends Paginated<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  links: PaginatedLinks;

  @ApiProperty()
  meta: PaginatedMeta<T>;
}
