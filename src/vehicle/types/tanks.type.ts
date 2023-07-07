import { ApiProperty } from '@nestjs/swagger';

export class ITanksVolume {
  @ApiProperty({ required: true, description: 'Порядковый номер' })
  index: number;

  @ApiProperty({ required: true, description: 'Объём' })
  volume: number;
}
export class ITanksCalibration {
  @ApiProperty({ required: true, description: 'Порядковый номер' })
  index: number;

  @ApiProperty({ required: true, description: 'Объём' })
  volume: number;
}
