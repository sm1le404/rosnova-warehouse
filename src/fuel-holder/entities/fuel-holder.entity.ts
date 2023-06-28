import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Outcome } from '../../outcome/entities/outcome.entity';
import { Supply } from '../../supply/entities/supply.entity';

@Entity()
export class FuelHolder extends CommonEntity {
  @ApiProperty({ required: true, description: 'Полное наименование' })
  @Column({ type: 'varchar', nullable: false })
  fullName: string;

  @ApiProperty({ required: false, description: 'Краткое наименование' })
  @Column({ type: 'varchar', nullable: true })
  shortName?: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @ManyToOne(() => Tank, (tank) => tank.fuelHolder)
  tank: Tank;

  @ManyToOne(() => Outcome, (outcome) => outcome.fuelHolder)
  outcome: Outcome;

  @ManyToOne(() => Supply, (supply) => supply.fuelHolder)
  supply: Supply;
}
