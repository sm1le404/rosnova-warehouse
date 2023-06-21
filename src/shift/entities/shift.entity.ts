import { Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Event } from '../../event/entities/event.entity';

@Entity()
export class Shift extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  startedAt: number;

  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  closedAt: number;

  @ApiProperty()
  @OneToMany(() => Event, (event) => event.shift)
  event: Event[];
}
