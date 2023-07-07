import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { SupplyType } from '../enums';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { Driver } from '../../driver/entities/driver.entity';

@Entity()
export class Supply extends CommonEntity {
  @ApiProperty({ required: true, description: 'Тип поставки' })
  @Column({
    type: 'text',
    enum: SupplyType,
    default: SupplyType.PROCESS,
  })
  type: SupplyType;

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

  @ApiProperty({ required: true, description: 'Фактически в резервуаре' })
  @Column({ type: 'float', nullable: false })
  factByTank: number;

  @ApiProperty({
    required: true,
    description: 'Разница документарного и фактического веса',
  })
  @Column({ type: 'float', nullable: false })
  differenceWeight: number;

  @ApiProperty({ required: true, description: 'Объём до' })
  @Column({ type: 'float', nullable: false })
  volumeBefore: number;

  @ApiProperty({ required: true, description: 'Объём после' })
  @Column({ type: 'float', nullable: false })
  volumeAfter: number;

  @ApiProperty({ required: true, description: 'Уровень до' })
  @Column({ type: 'float', nullable: false })
  levelBefore: number;

  @ApiProperty({ required: true, description: 'Уровень после' })
  @Column({ type: 'float', nullable: false })
  levelAfter: number;

  @ApiProperty({
    type: () => Vehicle,
    required: true,
    description: 'Транспортное средство',
  })
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.supply, { eager: true })
  vehicle: Vehicle;

  @ApiProperty({ type: () => Tank, required: true, description: 'Резервуар' })
  @ManyToOne(() => Tank, (tank) => tank.supply, { eager: true })
  tank: Tank;

  @ApiProperty({ type: () => Shift, required: true, description: 'Смена' })
  @ManyToOne(() => Shift, (shift) => shift.supply, { eager: true })
  shift: Shift;

  @ApiProperty({ type: () => Fuel, required: true, description: 'Топливо' })
  @ManyToOne(() => Fuel, (fuel) => fuel.supply, { eager: true })
  fuel: Fuel;

  @ApiProperty({
    type: () => FuelHolder,
    required: true,
    description: 'Топливодержатель',
  })
  @ManyToOne(() => FuelHolder, (fuelHolder) => fuelHolder.supply, {
    eager: true,
  })
  fuelHolder: FuelHolder;

  @ApiProperty({ type: () => Refinery, required: true, description: 'Завод' })
  @ManyToOne(() => Refinery, (refinery) => refinery.supply, { eager: true })
  refinery: Refinery;

  @ApiProperty({ type: () => Driver, required: true, description: 'Водитель' })
  @ManyToOne(() => Driver, (driver) => driver.id, { eager: true })
  driver: Driver;
}
