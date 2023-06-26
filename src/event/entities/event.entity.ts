import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { EventType, EventCollectionType } from '../enums';
import { Shift } from '../../shift/entities/shift.entity';

@Entity()
export class Event extends CommonEntity {
  @ApiProperty({ description: 'Название' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({ description: 'Тип события' })
  @Column({
    type: 'text',
    enum: EventType,
    default: EventType.DEFAULT,
  })
  type: EventType;

  @ApiProperty({ description: 'Название коллекции события' })
  @Column({
    type: 'text',
    enum: EventCollectionType,
    default: EventCollectionType.DEFAULT,
  })
  collection: EventCollectionType;

  @ApiProperty({ description: 'Дата до' })
  @Column({ type: 'varchar', nullable: false })
  dataBefore: string;

  @ApiProperty({ description: 'Дата после' })
  @Column({ type: 'varchar', nullable: false })
  dataAfter: string;

  @ApiProperty({ type: () => Shift, description: 'Связная смена' })
  @ManyToOne(() => Shift, (shift) => shift.event)
  shift: Shift;
}
