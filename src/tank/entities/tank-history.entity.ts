import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';

import { Tank } from './tank.entity';

@Entity()
export class TankHistory extends CommonEntity {
  @ApiProperty({ required: true, description: 'Температура' })
  @Column({ type: 'float', nullable: false, default: 0 })
  temperature?: number;

  @ApiProperty({ required: true, description: 'Объём' })
  @Column({ type: 'float', nullable: false, default: 0 })
  volume?: number;

  @ApiProperty({ required: true, description: 'Вес' })
  @Column({ type: 'float', nullable: false, default: 0 })
  weight?: number;

  @ApiProperty({ required: true, description: 'Плотность' })
  @Column({ type: 'float', nullable: false, default: 0 })
  density?: number;

  @ApiProperty({
    type: () => Tank,
    required: false,
    description: 'Связный резервуар',
  })
  @ManyToOne(() => Tank, (tank) => tank.tankHistory)
  tank?: Tank;
}
