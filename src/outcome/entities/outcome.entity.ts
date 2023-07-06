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
  @ApiProperty({ required: true, description: 'Тип топлива' })
  @Column({
    type: 'text',
    enum: StatusType,
    default: StatusType.PROCESS,
  })
  status: StatusType;

  @ApiProperty({ required: true, description: 'Номер накладной' })
  @Column({ type: 'int', nullable: false })
  numberTTN: number;

  @ApiProperty({ required: true, description: 'Объём по документам' })
  @Column({ type: 'float', nullable: false })
  docVolume: number;

  @ApiProperty({ required: true, description: 'Вес по документам' })
  @Column({ type: 'float', nullable: false })
  docWeight: number;

  @ApiProperty({ required: true, description: 'Плотность по документам' })
  @Column({ type: 'float', nullable: false })
  docDensity: number;

  @ApiProperty({ required: true, description: 'Температура по документам' })
  @Column({ type: 'float', nullable: false })
  docTemperature: number;

  @ApiProperty({ required: true, description: 'Фактический объём' })
  @Column({ type: 'float', nullable: false })
  factVolume: number;

  @ApiProperty({ required: true, description: 'Фактический вес' })
  @Column({ type: 'float', nullable: false })
  factWeight: number;

  @ApiProperty({ required: true, description: 'Фактическая плотность' })
  @Column({ type: 'float', nullable: false })
  factDensity: number;

  @ApiProperty({ required: true, description: 'Счётчик до' })
  @Column({ type: 'float', nullable: false })
  counterBefore: number;

  @ApiProperty({ required: true, description: 'Счётчик после' })
  @Column({ type: 'float', nullable: false })
  counterAfter: number;

  @ApiProperty({ required: true, description: 'Объём до' })
  @Column({ type: 'float', nullable: false })
  volumeBefore: number;

  @ApiProperty({ required: true, description: 'Объём после' })
  @Column({ type: 'float', nullable: false })
  volumeAfter: number;

  @ApiProperty({
    type: () => Dispenser,
    required: true,
    description: 'Колонка',
  })
  @ManyToOne(() => Dispenser, (dispenser) => dispenser.outcome, { eager: true })
  dispenser: Dispenser;

  @ApiProperty({ type: () => Driver, required: true, description: 'Водитель' })
  @ManyToOne(() => Driver, (driver) => driver.outcome, { eager: true })
  driver: Driver;

  @ApiProperty({
    type: () => Vehicle,
    required: true,
    description: 'Траспортное средство',
  })
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.outcome, { eager: true })
  vehicle: Vehicle;

  @ApiProperty({ type: () => Tank, required: true, description: 'Резервуар' })
  @ManyToOne(() => Tank, (tank) => tank.outcome, { eager: true })
  tank: Tank;

  @ApiProperty({ type: () => Shift, required: true, description: 'Смена' })
  @ManyToOne(() => Shift, (shift) => shift.outcome, { eager: true })
  shift: Shift;

  @ApiProperty({ type: () => Fuel, required: true, description: 'Топливо' })
  @ManyToOne(() => Fuel, (fuel) => fuel.outcome, { eager: true })
  fuel: Fuel;

  @ApiProperty({
    type: () => FuelHolder,
    required: true,
    description: 'Топливодержатель',
  })
  @ManyToOne(() => FuelHolder, (fuelHolder) => fuelHolder.outcome, {
    eager: true,
  })
  fuelHolder: FuelHolder;
}
