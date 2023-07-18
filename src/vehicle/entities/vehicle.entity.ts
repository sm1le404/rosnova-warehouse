import { AfterLoad, Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty, PickType } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { VehicleType } from '../enums';
import { Operation } from '../../operations/entities/operation.entity';
import { IVehicleTank } from '../types';

@Entity()
export class Vehicle extends CommonEntity {
  @ApiProperty({ required: true, description: 'Тип ТС', type: 'string' })
  @Column({
    type: 'text',
    enum: VehicleType,
  })
  type: VehicleType;

  @ApiProperty({ required: true, description: 'Модель ТС' })
  @Column({
    type: 'text',
  })
  carModel: string;

  @ApiProperty({ required: true, description: 'Регистрационный номер ТС' })
  @Column({ type: 'varchar', nullable: false })
  regNumber: string;

  @ApiProperty({
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    required: true,
    description: 'Объект, содержащий номер и объём резервуара',
    isArray: true,
  })
  @Column({ type: 'text', nullable: false })
  tanksVolume: string;

  @ApiProperty({
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    required: true,
    description: 'Объект, содержащий номер и калибр резервуара',
    isArray: true,
  })
  @Column({ type: 'text', nullable: false })
  tanksCalibration: string;

  @ApiProperty({ required: true, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @OneToMany(() => Operation, (operation) => operation.vehicle)
  operation: Operation[];

  @AfterLoad()
  afterLoad() {
    if (this?.tanksVolume) {
      this.tanksVolume = JSON.parse(this.tanksVolume);
    }
    if (this?.tanksCalibration) {
      this.tanksCalibration = JSON.parse(this.tanksCalibration);
    }
  }
}
