import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Tank } from '../../tank/entities/tank.entity';

@Entity()
export class Fuel extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @ApiProperty({ type: () => Tank })
  @ManyToOne(() => Tank, (tank) => tank.fuel)
  tank: Tank;
}
