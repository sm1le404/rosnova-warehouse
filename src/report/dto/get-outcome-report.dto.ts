import { ApiProperty } from '@nestjs/swagger';

export class GetOutcomeReportDto {
  @ApiProperty({
    required: true,
    description: 'Фильтрация по смене',
  })
  shiftId: number;

  @ApiProperty({
    required: true,
    description: 'Фильтрация по дате (год, месяц, день)',
  })
  date: string;
}
