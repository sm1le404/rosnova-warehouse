import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ApiProperty, PickType } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { TrailerType } from '../enums';
import { Operation } from '../../operations/entities/operation.entity';
import { IVehicleTank } from '../types';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Trailer extends CommonEntity {
  @ApiProperty({
    required: false,
    description: 'Тип прицепа',
    type: 'string',
  })
  @Column({
    type: 'text',
    enum: TrailerType,
    default: TrailerType.TRAILER,
    nullable: true,
  })
  type?: TrailerType;

  @ApiProperty({ required: false, description: 'Модель прицепа' })
  @Column({
    type: 'text',
    nullable: true,
  })
  trailerModel?: string;

  @ApiProperty({ required: true, description: 'Регистрационный номер прицепа' })
  @Column({ type: 'varchar', nullable: false })
  regNumber: string;

  @ApiProperty({
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    required: true,
    description: 'Объект, содержащий номер и состояние резервуаров',
    isArray: true,
  })
  @Column({ type: 'text', nullable: true })
  currentState?: string;

  @ApiProperty({
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    required: true,
    description: 'Объект, содержащий номер и калибр резервуара',
    isArray: true,
  })
  @Column({ type: 'text', nullable: false })
  sectionVolumes: string;

  @ApiProperty({ required: true, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @OneToMany(() => Operation, (operation) => operation.trailer)
  operation: Operation[];

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.trailer)
  vehicle: Vehicle;

  @AfterLoad()
  afterLoad() {
    if (this?.currentState) {
      this.currentState = JSON.parse(this.currentState);
    }
    if (this?.sectionVolumes) {
      this.sectionVolumes = JSON.parse(this.sectionVolumes);
    }
  }
}
