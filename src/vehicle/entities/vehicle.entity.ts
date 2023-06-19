import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { CarModelType, VehicleType } from '../enums';

@Entity()
export class Vehicle extends CommonEntity {
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: VehicleType,
    default: VehicleType.TRUCK,
  })
  type: VehicleType;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: CarModelType,
    default: CarModelType.UNKNOWN,
  })
  carModel: CarModelType;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  regNumber: string;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  tanksVolume: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  tanksCalibration: number;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;
}
