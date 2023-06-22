import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { SupplyType } from '../enums';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Shift } from '../../shift/entities/shift.entity';

@Entity()
export class Supply extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  driverName: string;

  @ApiProperty()
  @Column({
    type: 'text',
    enum: SupplyType,
    default: SupplyType.PROCESS,
  })
  type: SupplyType;

  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  numberTTN: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  docVolume: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  docWeight: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  docDensity: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  docTemperature: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  factVolume: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  factWeight: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  factDensity: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  factByTank: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  difference: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  volumeBefore: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  volumeAfter: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  levelBefore: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  levelAfter: number;

  @ApiProperty({ type: () => Vehicle })
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.supply)
  vehicle: Vehicle;

  @ApiProperty({ type: () => Tank })
  @ManyToOne(() => Tank, (tank) => tank.supply)
  tank: Tank;

  @ApiProperty({ type: () => Shift })
  @ManyToOne(() => Shift, (shift) => shift.supply)
  shift: Shift;
}
