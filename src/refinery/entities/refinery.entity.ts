import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Supply } from '../../supply/entities/supply.entity';
import { Outcome } from '../../outcome/entities/outcome.entity';

@Entity()
export class Refinery extends CommonEntity {
  @ApiProperty({ required: true, description: 'Полное наименование' })
  @Column({ type: 'varchar', nullable: false })
  fullName: string;

  @ApiProperty({ required: false, description: 'Краткое наименование' })
  @Column({ type: 'varchar', nullable: true })
  shortName?: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @OneToMany(() => Tank, (tank) => tank.refinery)
  tank: Tank[];

  @ManyToOne(() => Supply, (supply) => supply.refinery)
  supply: Supply;

  @ManyToOne(() => Outcome, (outcome) => outcome.fuelHolder)
  outcome: Outcome;
}
