import { ApiProperty } from '@nestjs/swagger';

export class GetMx2Dto {
  @ApiProperty({
    required: false,
    description: 'Фильтрация по дате операции от',
  })
  dateStart?: number;

  @ApiProperty({
    required: false,
    description: 'Фильтрация по дате операции до',
  })
  dateEnd?: number;
}
