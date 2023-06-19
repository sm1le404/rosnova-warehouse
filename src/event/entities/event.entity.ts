import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { EventType, EventCollectionType } from '../enums';
import { Shift } from '../../shift/entities/shift.entity';

@Entity()
export class Event extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.PROCESS,
  })
  type: EventType;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: EventCollectionType,
    default: EventCollectionType.PROCESS,
  })
  collection: EventCollectionType;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  dataBefore: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  dataAfter: string;

  @ApiProperty()
  @ManyToOne(() => Shift, (shift) => shift.event)
  shift: Shift;
}
