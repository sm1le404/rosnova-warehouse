import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { StatusType } from '../enums';

@Entity()
export class Outcome extends CommonEntity {
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.PROCESS,
  })
  status: StatusType;

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
  counterBefore: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  counterAfter: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  volumeBefore: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  volumeAfter: number;
}
