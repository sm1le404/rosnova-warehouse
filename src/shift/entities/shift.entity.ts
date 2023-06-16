import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class Shift extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'timestamp', nullable: false })
  startedAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: false })
  closedAt: Date;
}
