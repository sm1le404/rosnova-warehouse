import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class IVehicleTank {
  @ApiProperty({ required: true, description: 'Порядковый номер' })
  @IsInt()
  index: number;

  @ApiProperty({ required: true, description: 'Объём' })
  @IsInt()
  volume: number;

  @ApiProperty({ required: true, description: 'Плотность' })
  @IsInt()
  density: number;

  @ApiProperty({ required: true, description: 'Температура' })
  @IsInt()
  temperature: number;
}
