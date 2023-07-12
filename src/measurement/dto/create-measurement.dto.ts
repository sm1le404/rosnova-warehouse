import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Shift } from '../../shift/entities/shift.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { CommonId } from '../../common/types/common-id.type';

export class CreateMeasurementDto {
  @ApiProperty({
    type: () => CommonId,
    description: 'id смена',
  })
  shift: Pick<Shift, 'id'>;

  @ApiProperty({
    type: () => CommonId,
    description: 'id резервуар',
  })
  tank: Pick<Tank, 'id'>;

  @ApiProperty({ required: true, description: 'Объём' })
  @IsNumber()
  @Min(0)
  volume: number;

  @ApiProperty({ required: true, description: 'Вес' })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({ required: true, description: 'Плотность' })
  @IsNumber()
  @Min(0)
  density: number;

  @ApiProperty({ required: true, description: 'Температура' })
  @IsNumber()
  temperature: number;

  @ApiProperty({ required: true, description: 'Уровень' })
  @IsNumber()
  @Min(0)
  level: number;
}
