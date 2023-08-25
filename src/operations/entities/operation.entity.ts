import { AfterLoad, Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { OperationStatus, OperationType } from '../enums';
import { Dispenser } from '../../dispenser/entities/dispenser.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { IVehicleTank } from '../../vehicle/types';
import { Trailer } from '../../vehicle/entities/trailer.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';

@Entity()
export class Operation extends CommonEntity {
  @ApiProperty({ required: true, description: 'Тип операции' })
  @Column({
    type: 'text',
    enum: OperationType,
  })
  type: OperationType;

  @ApiProperty({ required: false, description: 'Статус операции' })
  @Column({
    type: 'text',
    enum: OperationStatus,
    default: OperationStatus.CREATED,
  })
  status?: OperationStatus;

  @ApiProperty({
    type: () => IVehicleTank,
    isArray: true,
    required: false,
    description: 'Состояние резервуаров ТС',
  })
  @Column({ type: 'text', nullable: true })
  vehicleState?: string;

  @ApiProperty({
    required: false,
    description: 'Назначение',
  })
  @Column({ type: 'text', nullable: true })
  destination?: string;

  @ApiProperty({ required: true, description: 'Номер накладной' })
  @Column({ type: 'text', nullable: true })
  numberTTN?: string;

  @ApiProperty({ description: 'Дата начала операции' })
  @Column({ type: 'integer', default: () => `strftime('%s', 'now')` })
  startedAt?: number;

  @ApiProperty({ description: 'Дата начала операции ISO' })
  startedAtIso?: string;

  @ApiProperty({ description: 'Дата завершения операции' })
  @Column({ type: 'integer', default: () => `strftime('%s', 'now')` })
  finishedAt?: number;

  @ApiProperty({ description: 'Дата завершения операции ISO' })
  finishedAtIso?: string;

  @ApiProperty({ required: true, description: 'Объём по документам' })
  @Column({ type: 'float', nullable: false })
  docVolume: number;

  @ApiProperty({ required: false, description: 'Объём по факту' })
  @Column({ type: 'float', nullable: true })
  factVolume?: number;

  @ApiProperty({ required: false, description: 'Вес по факту' })
  @Column({ type: 'float', nullable: true })
  factWeight?: number;

  @ApiProperty({ required: true, description: 'Вес по документам' })
  @Column({ type: 'float', nullable: false })
  docWeight: number;

  @ApiProperty({ required: true, description: 'Плотность по документам' })
  @Column({ type: 'float', nullable: false })
  docDensity: number;

  @ApiProperty({ required: true, description: 'Температура по документам' })
  @Column({ type: 'float', nullable: false })
  docTemperature: number;

  @ApiProperty({ required: true, description: 'Счётчик до' })
  @Column({ type: 'float', nullable: true, default: 0 })
  counterBefore: number;

  @ApiProperty({ required: true, description: 'Счётчик после' })
  @Column({ type: 'float', nullable: true, default: 0 })
  counterAfter: number;

  @ApiProperty({ required: true, description: 'Объём до', default: 0 })
  @Column({ type: 'float', nullable: true, default: 0 })
  volumeBefore: number;

  @ApiProperty({ required: true, description: 'Объём после', default: 0 })
  @Column({ type: 'float', nullable: true, default: 0 })
  volumeAfter: number;

  @ApiProperty({ required: true, description: 'Уровень до', default: 0 })
  @Column({ type: 'float', nullable: true, default: 0 })
  levelBefore: number;

  @ApiProperty({ required: true, description: 'Уровень после', default: 0 })
  @Column({ type: 'float', nullable: true, default: 0 })
  levelAfter: number;

  @ApiProperty({
    required: false,
    description: 'Ошибка на колонке',
    default: false,
  })
  @Column({ type: 'boolean', nullable: true, default: false })
  dispenserError: boolean;

  @ApiProperty({
    type: () => Dispenser,
    required: true,
    description: 'Колонка',
  })
  @ManyToOne(() => Dispenser, (dispenser) => dispenser.operation, {
    eager: true,
  })
  dispenser: Dispenser;

  @ApiProperty({ type: () => Driver, required: false, description: 'Водитель' })
  @ManyToOne(() => Driver, (driver) => driver.operation, { eager: true })
  driver?: Driver;

  @ApiProperty({
    type: () => Fuel,
    required: true,
    description: 'Топливо',
  })
  @ManyToOne(() => Fuel, (fuel) => fuel.operation, { eager: true })
  fuel: Fuel;

  @ApiProperty({
    type: () => FuelHolder,
    required: true,
    description: 'Владелец топлива',
  })
  @ManyToOne(() => FuelHolder, (fuelHolder) => fuelHolder.operation, {
    eager: true,
  })
  fuelHolder: FuelHolder;

  @ApiProperty({
    type: () => Refinery,
    required: true,
    description: 'Завод',
  })
  @ManyToOne(() => Refinery, (refinery) => refinery.operation, { eager: true })
  refinery: Refinery;

  @ApiProperty({
    type: () => Trailer,
    required: false,
    description: 'Прицеп',
  })
  @ManyToOne(() => Trailer, (trailer) => trailer.operation, { eager: true })
  trailer?: Trailer;

  @ApiProperty({
    type: () => Vehicle,
    required: false,
    description: 'ТС',
  })
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.operation, { eager: true })
  vehicle?: Vehicle;

  @ApiProperty({ type: () => Tank, required: true, description: 'Резервуар' })
  @ManyToOne(() => Tank, (tank) => tank.operation, { eager: true })
  tank: Tank;

  @ApiProperty({ type: () => Shift, required: true, description: 'Смена' })
  @ManyToOne(() => Shift, (shift) => shift.operation, { eager: true })
  shift: Shift;

  @AfterLoad()
  afterLoad() {
    if (this?.vehicleState) {
      try {
        this.vehicleState = JSON.parse(this.vehicleState);
      } catch (e) {
        this.vehicleState = null;
      }
    }
  }
}
