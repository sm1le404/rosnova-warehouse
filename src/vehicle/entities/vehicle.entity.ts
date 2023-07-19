import { Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { VehicleType } from '../enums';
import { Trailer } from './trailer.entity';

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

  @ApiProperty({ required: true, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @OneToMany(() => Trailer, (trailer) => trailer.vehicle)
  trailer: Trailer[];
}
