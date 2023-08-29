import { ApiProperty } from '@nestjs/swagger';

export class TankSummaryManualInterface {
  @ApiProperty({ description: 'ID резевуара' })
  tankId: number;

  @ApiProperty({ description: 'Значение объема' })
  volume: number;

  @ApiProperty({ description: 'Значение веса' })
  weight: number;
}
