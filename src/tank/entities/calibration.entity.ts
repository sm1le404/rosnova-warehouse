import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Tank } from './tank.entity';

@Entity()
export class Calibration extends CommonEntity {
  @ApiProperty({ required: false, description: 'Калибр по таблице объёмов' })
  @Column({ type: 'float', nullable: true, default: 0 })
  volume?: number;

  @ApiProperty({ required: false, description: 'Калибр по таблице уровней' })
  @Column({ type: 'float', nullable: true, default: 0 })
  level?: number;

  @ApiProperty({
    type: () => Tank,
    required: false,
    description: 'Связный резервуар',
  })
  @ManyToOne(() => Tank, (tank) => tank.calibration)
  tank?: Tank;
}
