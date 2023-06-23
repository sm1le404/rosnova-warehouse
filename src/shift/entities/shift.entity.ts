import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Event } from '../../event/entities/event.entity';
import { Outcome } from '../../outcome/entities/outcome.entity';
import { Supply } from '../../supply/entities/supply.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Shift extends CommonEntity {
  @ApiProperty({ required: true, description: 'Открытие' })
  @Column({ type: 'int', nullable: false })
  startedAt: number;

  @ApiProperty({ required: true, description: 'Закрытие' })
  @Column({ type: 'int', nullable: false })
  closedAt: number;

  @ApiProperty({
    type: () => Event,
    isArray: true,
    required: true,
    description: 'Связное событие',
  })
  @OneToMany(() => Event, (event) => event.shift)
  event: Event[];

  @OneToMany(() => Outcome, (outcome) => outcome.shift)
  outcome: Outcome[];

  @OneToMany(() => Supply, (supply) => supply.shift)
  supply: Supply[];

  @ApiProperty({
    type: () => User,
    required: true,
    description: 'Связный пользователь',
  })
  @ManyToOne(() => User, (user) => user.shift)
  user: User;
}
