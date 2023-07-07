import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
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

  @ApiProperty({ required: true, description: 'Температура' })
  @IsNumber()
  temperature: number;

  @ApiProperty({ required: true, description: 'Уровень' })
  @IsPositive()
  level: number;

  @ApiProperty({
    type: () => PickType(Shift, ['id']),
    description: 'id смена',
  })
  shift: Pick<Shift, 'id'>;

  @ApiProperty({
    type: () => PickType(Tank, ['id']),
    description: 'id резервуар',
  })
  tank: Pick<Tank, 'id'>;
}
