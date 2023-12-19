import { ApiProperty } from '@nestjs/swagger';

export class DispenserSummaryInterface {
  @ApiProperty({ description: 'Идентификатор колонки' })
  dispenserId: number;

  @ApiProperty({ description: 'Показания суммарников' })
  summary: number;
}
