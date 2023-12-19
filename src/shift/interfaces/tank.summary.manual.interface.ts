import { ApiProperty } from '@nestjs/swagger';

export class TankSummaryManualInterface {
  @ApiProperty({ description: 'ID резевуара' })
  id: number;

  @ApiProperty({ description: 'Значение объема' })
  volume: number;

  @ApiProperty({ description: 'Значение веса' })
  weight: number;

  @ApiProperty({ description: 'Уровень' })
  level: number;
}
