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
  @ApiProperty({ required: true, description: 'Тип топлива' })
  @Column({
    type: 'text',
    enum: ActiveFuelType,
    default: ActiveFuelType.PETROL,
  })
  activeFuel: ActiveFuelType;

  @ApiProperty({ required: true, description: 'Порядок сортировки' })
  @Column({ type: 'int', nullable: false })
  sortIndex: number;

  @ApiProperty({ required: true, description: 'Калибр по таблице' })
  @Column({ type: 'float', nullable: false })
  calibrationTable: number;

  @ApiProperty({ required: true, description: 'Общий объём' })
  @Column({ type: 'float', nullable: false })
  totalVolume: number;

  @ApiProperty({ required: true, description: 'Критический баланс' })
  @Column({ type: 'float', nullable: false })
  deathBalance: number;

  @ApiProperty({ required: true, description: 'Температура' })
  @Column({ type: 'float', nullable: false })
  temperature: number;

  @ApiProperty({ required: true, description: 'Объём' })
  @Column({ type: 'float', nullable: false })
  volume: number;

  @ApiProperty({ required: true, description: 'Вес' })
  @Column({ type: 'float', nullable: false })
  weight: number;

  @ApiProperty({ required: true, description: 'Плотность' })
  @Column({ type: 'float', nullable: false })
  density: number;

  @ApiProperty({ required: true, description: 'Уровень' })
  @Column({ type: 'int', nullable: false })
  level: number;

  @ApiProperty({ required: false, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @ApiProperty({
    type: () => Measurement,
    isArray: true,
    required: true,
    description: 'Замеры',
  })
  @OneToMany(() => Measurement, (measurement) => measurement.tank)
  measurement: Measurement[];

  @OneToMany(() => Outcome, (outcome) => outcome.tank)
  outcome: Outcome[];

  @OneToMany(() => Supply, (supply) => supply.tank)
  supply: Supply[];

  @ApiProperty({
    type: () => Fuel,
    isArray: true,
    required: true,
    description: 'Вид топлива',
  })
  @OneToMany(() => Fuel, (fuel) => fuel.tank)
  fuel: Fuel[];

  @ApiProperty({
    type: () => FuelHolder,
    isArray: true,
    required: true,
    description: 'Владелец топлива',
  })
  @OneToMany(() => FuelHolder, (fuelHolder) => fuelHolder.tank)
  fuelHolder: FuelHolder[];

  @ApiProperty({
    type: () => Refinery,
    isArray: true,
    required: true,
    description: 'Завод',
  })
  @OneToMany(() => Refinery, (refinery) => refinery.tank)
  refinery: Refinery[];
}
