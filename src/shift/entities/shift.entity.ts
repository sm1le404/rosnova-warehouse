import { Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Event } from '../../event/entities/event.entity';

@Entity()
export class Shift extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'timestamp', nullable: false })
  startedAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: false })
  closedAt: Date;

  @ApiProperty()
  @OneToMany(() => Event, (event) => event.shift)
  event: Event;
}
