import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';

import { Tank } from './tank.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';

@Entity()
export class TankHistory extends CommonEntity {
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

  @ApiProperty({ required: true, description: 'Документальный объем' })
  @Column({ type: 'float', nullable: false, default: 0 })
  docVolume?: number;

  @ApiProperty({ required: true, description: 'Документальный вес' })
  @Column({ type: 'float', nullable: false, default: 0 })
  docWeight?: number;

  @ApiProperty({
    type: () => Tank,
    required: false,
    description: 'Связный резервуар',
  })
  @ManyToOne(() => Tank, (tank) => tank.tankHistory)
  tank?: Tank;
}
