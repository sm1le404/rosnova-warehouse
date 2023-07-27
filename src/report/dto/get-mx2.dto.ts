import { ApiProperty } from '@nestjs/swagger';

export class GetMx2Dto {
  @ApiProperty({
    required: false,
    description: 'Фильтрация по дате операции от',
  })
  startedAtFrom?: number;

  @ApiProperty({
    required: false,
    description: 'Фильтрация по дате операции до',
  })
  startedAtTo?: number;
}
