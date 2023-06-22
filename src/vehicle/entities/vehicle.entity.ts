import { Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { CarModelType, VehicleType } from '../enums';
import { Outcome } from '../../outcome/entities/outcome.entity';
import { Supply } from '../../supply/entities/supply.entity';

@Entity()
export class Vehicle extends CommonEntity {
  @ApiProperty()
  @Column({
    type: 'text',
    enum: VehicleType,
    default: VehicleType.TRUCK,
  })
  type: VehicleType;

  @ApiProperty()
  @Column({
    type: 'text',
    enum: CarModelType,
    default: CarModelType.UNKNOWN,
  })
  carModel: CarModelType;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  regNumber: string;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  tanksVolume: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  tanksCalibration: number;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @OneToMany(() => Outcome, (outcome) => outcome.vehicle)
  outcome: Outcome[];

  @OneToMany(() => Supply, (supply) => supply.vehicle)
  supply: Supply[];
}
