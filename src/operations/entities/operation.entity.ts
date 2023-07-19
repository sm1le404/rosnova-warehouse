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

@Entity()
export class Operation extends CommonEntity {
  @ApiProperty({ required: true, description: 'Тип операции' })
  @Column({
    type: 'text',
    enum: OperationType,
  })
  type: OperationType;

  @ApiProperty({ required: true, description: 'Статус операции' })
  @Column({
    type: 'text',
    enum: OperationStatus,
    default: OperationStatus.CREATED,
  })
  status: OperationStatus;

  @ApiProperty({
    type: () => IVehicleTank,
    isArray: true,
    required: true,
    description: 'Состояние резервуаров ТС',
  })
  @Column({ type: 'text', nullable: false })
  vehicleState: string;

  @ApiProperty({
    required: true,
    description: 'Полное наименование топлива',
  })
  @Column({ type: 'text', nullable: false })
  fuel: string;

  @ApiProperty({
    required: true,
    description: 'Полное наименование владельца топлива',
  })
  @Column({ type: 'text', nullable: false })
  fuelHolder: string;

  @ApiProperty({
    required: true,
    description: 'Полное наименование завода',
  })
  @Column({ type: 'text', nullable: false })
  refinery: string;

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

  @ApiProperty({ required: true, description: 'Фактически в резервуаре' })
  @Column({ type: 'float', nullable: false })
  factByTank: number;

  @ApiProperty({
    required: true,
    description: 'Разница документарного и фактического веса',
  })
  @Column({ type: 'float', nullable: false })
  differenceWeight: number;

  @ApiProperty({ required: true, description: 'Уровень до', default: 0 })
  @Column({ type: 'float', nullable: true, default: 0 })
  levelBefore: number;

  @ApiProperty({ required: true, description: 'Уровень после', default: 0 })
  @Column({ type: 'float', nullable: true, default: 0 })
  levelAfter: number;

  @ApiProperty({
    type: () => Dispenser,
    required: true,
    description: 'Колонка',
  })
  @ManyToOne(() => Dispenser, (dispenser) => dispenser.operation, {
    eager: true,
  })
  dispenser: Dispenser;

  @ApiProperty({ type: () => Driver, required: true, description: 'Водитель' })
  @ManyToOne(() => Driver, (driver) => driver.operation, { eager: true })
  driver: Driver;

  @ApiProperty({
    type: () => Trailer,
    required: true,
    description: 'Прицеп',
  })
  @ManyToOne(() => Trailer, (trailer) => trailer.operation, { eager: true })
  trailer: Trailer;

  @ApiProperty({ type: () => Tank, required: true, description: 'Резервуар' })
  @ManyToOne(() => Tank, (tank) => tank.operation, { eager: true })
  tank: Tank;

  @ApiProperty({ type: () => Shift, required: true, description: 'Смена' })
  @ManyToOne(() => Shift, (shift) => shift.operation, { eager: true })
  shift: Shift;

  @AfterLoad()
  afterLoad() {
    if (this?.vehicleState) {
      this.vehicleState = JSON.parse(this.vehicleState);
    }
  }
}
