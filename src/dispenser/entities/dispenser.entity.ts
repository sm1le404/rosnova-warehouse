import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class Dispenser extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  sortIndex: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  currentCounter: number;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;
}
