import { ApiProperty } from '@nestjs/swagger';

export class TankSummaryInterface {
  @ApiProperty({ description: 'ID резевуара' })
  id: number;

  @ApiProperty({ required: true, description: '№ РГС' })
  sortIndex: number;

  @ApiProperty({ description: 'Значение объема' })
  volume: number;

  @ApiProperty({ description: 'Значение веса' })
  weight: number;

  @ApiProperty({ description: 'Документальное значение объема' })
  docVolume: number;

  @ApiProperty({ description: 'Документальное значение веса' })
  docWeight: number;

  @ApiProperty({ description: 'ID типа топлива' })
  fuelId: number;

  @ApiProperty({ description: 'ID Владельца топлива' })
  fuelHolderId: number;

  @ApiProperty({ description: 'ID Завода' })
  refineryId: number;
}
