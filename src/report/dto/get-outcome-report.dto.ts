import { ApiProperty } from '@nestjs/swagger';

export class GetOutcomeReportDto {
  @ApiProperty({
    required: true,
    description: 'Фильтрация по смене',
  })
  shiftId: number;

  @ApiProperty({
    required: false,
    description: 'Фильтрация по дате в формате timestamp (s)',
  })
  dateStart?: number;

  @ApiProperty({
    required: false,
    description: 'Фильтрация по дате в формате timestamp (s)',
  })
  dateEnd?: number;
}
