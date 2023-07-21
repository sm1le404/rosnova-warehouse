import { Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Operation } from '../../operations/entities/operation.entity';

@Entity()
export class Fuel extends CommonEntity {
  @ApiProperty({ required: true, description: 'Название топлива' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({ required: true, description: 'Полное название топлива' })
  @Column({ type: 'varchar', nullable: false })
  fullName: string;

  @ApiProperty({ required: true, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @OneToMany(() => Tank, (tank) => tank.fuel)
  tank?: Tank[];

  @OneToMany(() => Operation, (operation) => operation.fuel)
  operation?: Operation[];
}
