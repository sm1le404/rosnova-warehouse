import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Outcome } from '../../outcome/entities/outcome.entity';
import { Supply } from '../../supply/entities/supply.entity';

@Entity()
export class Fuel extends CommonEntity {
  @ApiProperty({ required: true, description: 'Название топлива' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({ required: true, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @ApiProperty({
    type: () => Tank,
    required: true,
    isArray: true,
    description: 'Связный резервуар',
  })
  @OneToMany(() => Tank, (tank) => tank.fuel)
  tank: Tank[];

  @ApiProperty({
    type: () => Outcome,
    required: true,
    description: 'Связная выдача',
  })
  @ManyToOne(() => Outcome, (outcome) => outcome.fuel)
  outcome: Outcome;

  @ApiProperty({
    type: () => Supply,
    required: true,
    description: 'Связный приход',
  })
  @ManyToOne(() => Supply, (supply) => supply.fuel)
  supply: Supply;
}
