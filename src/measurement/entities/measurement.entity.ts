import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { Tank } from '../../tank/entities/tank.entity';

@Entity()
export class Measurement extends CommonEntity {
  @ApiProperty({ required: true, description: 'Объём' })
  @Column({ type: 'float', nullable: false })
  volume: number;

  @ApiProperty({ required: true, description: 'Вес' })
  @Column({ type: 'float', nullable: false })
  weight: number;

  @ApiProperty({ required: true, description: 'Плотность' })
  @Column({ type: 'float', nullable: false })
  density: number;

  @ApiProperty({ required: true, description: 'Температура' })
  @Column({ type: 'float', nullable: false })
  temperature: number;

  @ApiProperty({ required: true, description: 'Уровень' })
  @Column({ type: 'int', nullable: false })
  level: number;

  @ApiProperty({
    type: () => Shift,
    required: true,
    description: 'Связная смена',
  })
  @OneToOne(() => Shift)
  @JoinColumn()
  shift: Shift;

  @ApiProperty({
    type: () => Tank,
    isArray: true,
    required: true,
    description: 'Связные резервуары',
  })
  @ManyToOne(() => Tank, (tank) => tank.measurement)
  tank: Tank;
}
