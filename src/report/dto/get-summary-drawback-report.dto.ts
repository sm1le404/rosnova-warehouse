import { ApiProperty } from '@nestjs/swagger';

export class GetSummaryDrawbackReportDto {
  @ApiProperty({
    description: 'Фильтрация по дате в формате timestamp (s)',
  })
  dateStart: number;

  @ApiProperty({
    description: 'Фильтрация по дате в формате timestamp (s)',
  })
  dateEnd: number;
}
