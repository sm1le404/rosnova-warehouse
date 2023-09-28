import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { ApiProperty, PickType } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { VehicleType } from '../enums';
import { Operation } from '../../operations/entities/operation.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Trailer } from './trailer.entity';
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
    required: false,
    description: 'Объект, содержащий номер и состояние резервуаров',
    isArray: true,
  })
  @Column({ type: 'text', nullable: true })
  currentState?: string;

  @ApiProperty({
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    required: false,
    description: 'Объект, содержащий номер и калибр резервуара',
    isArray: true,
  })
  @Column({ type: 'text', nullable: true })
  sectionVolumes?: string;

  @ApiProperty({ required: true, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @OneToMany(() => Operation, (operation) => operation.vehicle)
  operation: Operation[];

  @ApiProperty({
    type: () => Driver,
    required: false,
    description: 'Водитель',
  })
  @ManyToOne(() => Driver, (driver) => driver.vehicle, { eager: true })
  driver?: Driver;

  @ApiProperty({
    type: () => Trailer,
    required: false,
    description: 'Прицеп',
  })
  @ManyToOne(() => Trailer, (trailer) => trailer.vehicle, { eager: true })
  trailer?: Trailer;

  @AfterLoad()
  @AfterUpdate()
  @AfterInsert()
  afterLoad() {
    if (this?.currentState) {
      try {
        this.currentState = JSON.parse(this.currentState);
      } catch (e) {
        this.currentState = null;
      }
    }
    if (this?.sectionVolumes) {
      try {
        this.sectionVolumes = JSON.parse(this.sectionVolumes);
      } catch (e) {
        this.sectionVolumes = null;
      }
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  beforeUpdate() {
    if (this?.currentState) {
      this.currentState = JSON.stringify(this.currentState);
    }
    if (this?.sectionVolumes) {
      this.sectionVolumes = JSON.stringify(this.sectionVolumes);
    }
  }
}
