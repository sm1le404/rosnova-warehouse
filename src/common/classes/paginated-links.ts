import { ApiProperty } from '@nestjs/swagger';

export class PaginatedLinks {
  @ApiProperty()
  first?: string;

  @ApiProperty()
  previous?: string;

  @ApiProperty()
  current: string;

  @ApiProperty()
  next?: string;

  @ApiProperty()
  last?: string;
}
