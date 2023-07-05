import { Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { CarModelType, VehicleType } from '../enums';
import { Outcome } from '../../outcome/entities/outcome.entity';
import { Supply } from '../../supply/entities/supply.entity';
import { ITanksCalibration, ITanksVolume } from '../types';

@Entity()
export class Vehicle extends CommonEntity {
  @ApiProperty({ required: true, description: 'Тип ТС', type: 'string' })
  @Column({
    type: 'text',
    enum: VehicleType,
  })
  type: VehicleType;

  @ApiProperty({ required: true, description: 'Модель ТС', enum: CarModelType })
  @Column({
    type: 'text',
    enum: CarModelType,
    default: CarModelType.UNKNOWN,
  })
  carModel: CarModelType;

  @ApiProperty({ required: true, description: 'Регистрационный номер ТС' })
  @Column({ type: 'varchar', nullable: false })
  regNumber: string;

  @ApiProperty({
    required: true,
    description: 'Объект, содержащий номер и объём резервуара',
  })
  @Column({ type: 'text', nullable: false })
  tanksVolume: string;

  @ApiProperty({
    required: true,
    description: 'Объект, содержащий номер и калибр резервуара',
  })
  @Column({ type: 'text', nullable: false })
  tanksCalibration: string;

  @ApiProperty({ required: true, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @OneToMany(() => Outcome, (outcome) => outcome.vehicle)
  outcome: Outcome[];

  @OneToMany(() => Supply, (supply) => supply.vehicle)
  supply: Supply[];
}
