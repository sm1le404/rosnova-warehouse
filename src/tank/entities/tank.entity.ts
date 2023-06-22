import { Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { ActiveFuelType } from '../enum';
import { Measurement } from '../../measurement/entities/measurement.entity';
import { Supply } from '../../supply/entities/supply.entity';
import { Outcome } from '../../outcome/entities/outcome.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';

@Entity()
export class Tank extends CommonEntity {
  @ApiProperty()
  @Column({
    type: 'text',
    enum: ActiveFuelType,
    default: ActiveFuelType.PETROL,
  })
  activeFuel: ActiveFuelType;

  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  sortIndex: number;

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

  @ApiProperty({ type: () => Measurement, isArray: true })
  @OneToMany(() => Measurement, (measurement) => measurement.tank)
  measurement: Measurement[];

  @ApiProperty({ type: () => Outcome, isArray: true })
  @OneToMany(() => Outcome, (outcome) => outcome.tank)
  outcome: Outcome[];

  @ApiProperty({ type: () => Supply, isArray: true })
  @OneToMany(() => Supply, (supply) => supply.tank)
  supply: Supply[];

  @ApiProperty()
  @OneToMany(() => Fuel, (fuel) => fuel.tank)
  fuel: Fuel[];

  @ApiProperty({ type: () => FuelHolder, isArray: true })
  @OneToMany(() => FuelHolder, (fuelHolder) => fuelHolder.tank)
  fuelHolder: FuelHolder[];

  @ApiProperty({ type: () => Refinery, isArray: true })
  @OneToMany(() => Refinery, (refinery) => refinery.tank)
  refinery: Refinery[];
}
