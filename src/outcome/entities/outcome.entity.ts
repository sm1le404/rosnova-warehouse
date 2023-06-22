import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { StatusType } from '../enums';
import { Dispenser } from '../../dispenser/entities/dispenser.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';

@Entity()
export class Outcome extends CommonEntity {
  @ApiProperty()
  @Column({
    type: 'text',
    enum: StatusType,
    default: StatusType.PROCESS,
  })
  status: StatusType;

  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  numberTTN: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  docVolume: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  docWeight: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  docDensity: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  docTemperature: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  factVolume: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  factWeight: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  factDensity: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  counterBefore: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  counterAfter: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  volumeBefore: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  volumeAfter: number;

  @ApiProperty({ type: () => Dispenser })
  @ManyToOne(() => Dispenser, (dispenser) => dispenser.outcome)
  dispenser: Dispenser;

  @ApiProperty({ type: () => Driver })
  @ManyToOne(() => Driver, (driver) => driver.outcome)
  driver: Driver;

  @ApiProperty({ type: () => Vehicle })
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.outcome)
  vehicle: Vehicle;

  @ApiProperty({ type: () => Tank })
  @ManyToOne(() => Tank, (tank) => tank.outcome)
  tank: Tank;

  @ApiProperty({ type: () => Shift })
  @ManyToOne(() => Shift, (shift) => shift.outcome)
  shift: Shift;

  @ApiProperty({ type: () => Fuel })
  @ManyToOne(() => Fuel, (fuel) => fuel.outcome)
  fuel: Fuel;

  @ApiProperty({ type: () => FuelHolder })
  @ManyToOne(() => FuelHolder, (fuelHolder) => fuelHolder.outcome)
  fuelHolder: FuelHolder;
}
