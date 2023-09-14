import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class IVehicleTank {
  @ApiProperty({ required: true, description: 'Порядковый номер' })
  @IsInt()
  index: number;

  @ApiProperty({ required: true, description: 'Плотность' })
  @IsNumber()
  @Min(0)
  density: number;

  @ApiProperty({ required: true, description: 'Температура' })
  @IsNumber()
  @Min(0)
  temperature: number;

  @ApiProperty({ required: true, description: 'Объём' })
  @IsNumber()
  @Min(0)
  volume: number;

  @ApiProperty({ required: true, description: 'Максимальный объём' })
  @IsNumber()
  @Min(0)
  maxVolume: number;
}
