import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Measurement } from '../../measurement/entities/measurement.entity';
import { Operation } from '../../operations/entities/operation.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { Calibration } from './calibration.entity';
import { TankHistory } from './tank-history.entity';

@Entity()
export class Tank extends CommonEntity {
  @ApiProperty({ required: true, description: 'Порядок сортировки' })
  @Column({ type: 'int', nullable: false })
  sortIndex: number;

  @ApiProperty({ required: true, description: 'Общий объём' })
  @Column({ type: 'float', nullable: false })
  totalVolume: number;

  @ApiProperty({ required: true, description: 'Критический баланс' })
  @Column({ type: 'float', nullable: false, default: 0 })
  deathBalance?: number;

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

  @ApiProperty({ required: true, description: 'Уровень' })
  @Column({ type: 'int', nullable: false, default: 0 })
  level?: number;

  @ApiProperty({ required: false, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @ApiProperty({ required: false, description: 'Блокировка' })
  @Column({ type: 'boolean', default: false })
  isBlocked?: boolean;

  @ApiProperty({ required: true, description: 'Адрес на COM порте' })
  @Column({ type: 'int', nullable: true })
  addressId: number;

  @ApiProperty({
    type: () => Measurement,
    isArray: true,
    required: true,
    description: 'Замеры',
  })
  @OneToMany(() => Measurement, (measurement) => measurement.tank, {
    eager: true,
  })
  measurement: Measurement[];

  @OneToMany(() => Operation, (operation) => operation.tank)
  operation: Operation[];

  @ApiProperty({
    type: () => Fuel,
    required: false,
    description: 'Вид топлива',
  })
  @ManyToOne(() => Fuel, (fuel) => fuel.tank, { eager: true })
  fuel?: Fuel;

  @ApiProperty({
    type: () => FuelHolder,
    required: false,
    description: 'Владелец топлива',
  })
  @ManyToOne(() => FuelHolder, (fuelHolder) => fuelHolder.tank, { eager: true })
  fuelHolder?: FuelHolder;

  @ApiProperty({
    type: () => Refinery,
    required: false,
    description: 'Завод',
  })
  @ManyToOne(() => Refinery, (refinery) => refinery.tank, { eager: true })
  refinery?: Refinery;

  @ApiPropertyOptional({
    type: () => Calibration,
    required: false,
    description: 'Связный калибр',
  })
  @OneToMany(() => Calibration, (calibration) => calibration.tank)
  calibration?: Calibration[];

  @ApiProperty({
    type: () => TankHistory,
    required: false,
    description: 'История состояний резервуара',
  })
  @ManyToOne(() => TankHistory, (tankHistory) => tankHistory.tank, {
    cascade: true,
    eager: true,
  })
  tankHistory?: TankHistory;
}
