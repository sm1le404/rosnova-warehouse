import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { Tank } from '../../tank/entities/tank.entity';

@Entity()
export class Measurement extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  volume: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  weight: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  density: number;

  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  level: number;

  @ApiProperty({ type: () => Shift })
  @OneToOne(() => Shift)
  @JoinColumn()
  shift: Shift;

  @ApiProperty({ type: () => Tank, isArray: true })
  @ManyToOne(() => Tank, (tank) => tank.measurement)
  tank: Tank;
}
