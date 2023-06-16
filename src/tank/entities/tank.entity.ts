import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { ActiveFuelType } from '../enum';

@Entity()
export class Tank extends CommonEntity {
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ActiveFuelType,
    default: ActiveFuelType.PETROL,
  })
  activeFuel: ActiveFuelType;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  order: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  calibrationTable: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  totalVolume: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  deathBalance: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  temperature: number;

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

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;
}
