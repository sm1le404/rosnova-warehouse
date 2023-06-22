import { IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Shift } from '../../shift/entities/shift.entity';
import { Tank } from '../../tank/entities/tank.entity';

export class CreateMeasurementDto {

  @ApiProperty({ required: true, description: 'Объём' })
  @IsPositive()
  volume: number;

  @ApiProperty({ required: true, description: 'Вес' })
  @IsPositive()
  weight: number;

  @ApiProperty({ required: true, description: 'Плотность' })
  @IsPositive()
  density: number;

  @ApiProperty({ required: true, description: 'Уровень' })
  @IsPositive()
  level: number;

  @ApiProperty({
    type: 'int',
    description: 'id смена',
  })
  shift: Pick<Shift, 'id'>;

  @ApiProperty({
    type: 'int',
    description: 'id резервуар',
  })
  tank: Pick<Tank, 'id'>;
}
