import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Dispenser } from './dispenser.entity';
import { User } from '../../user/entities/user.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { Tank } from '../../tank/entities/tank.entity';

@Entity()
export class DispenserQueue extends CommonEntity {
  @ApiProperty({ type: () => Dispenser, required: true, description: 'ТРК' })
  @ManyToOne(() => Dispenser)
  dispenser: Dispenser;

  @ApiProperty({ type: () => User, required: true, description: 'Оператор' })
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({ type: () => Fuel, required: true, description: 'Топливо' })
  @ManyToOne(() => Fuel)
  fuel: Fuel;

  @ApiProperty({ type: () => Tank, required: true, description: 'Резевуар' })
  @ManyToOne(() => Tank)
  tank: Tank;

  @ApiProperty({ description: 'Доза в литрах' })
  @Column({ type: 'int', default: 0 })
  dose: number;
}
