import { ApiProperty } from '@nestjs/swagger';

export class CommonId {
  @ApiProperty({ description: 'Идентификатор', default: 1 })
  id: number;
}
