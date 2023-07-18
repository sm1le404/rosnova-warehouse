import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Event } from '../../event/entities/event.entity';
import { Operation } from '../../operations/entities/operation.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Shift extends CommonEntity {
  @ApiProperty({ required: true, description: 'Открытие' })
  @Column({ type: 'int', nullable: false })
  startedAt: number;

  @ApiProperty({ required: false, description: 'Закрытие' })
  @Column({ type: 'int', nullable: true })
  closedAt?: number;

  @ApiProperty({
    type: () => Event,
    isArray: true,
    description: 'Связное событие',
  })
  @OneToMany(() => Event, (event) => event.shift)
  event: Event[];

  @OneToMany(() => Operation, (operation) => operation.shift)
  operation: Operation[];

  @ApiProperty({
    type: () => User,
    required: true,
    description: 'Связный пользователь',
  })
  @ManyToOne(() => User, (user) => user.shift, { eager: true })
  user: User;
}
