import { Column, Entity, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Outcome } from '../../outcome/entities/outcome.entity';
import { Supply } from '../../supply/entities/supply.entity';

@Entity()
export class FuelHolder extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  fullName: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  shortName: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @ApiProperty({ type: () => Tank })
  @ManyToOne(() => Tank, (tank) => tank.fuelHolder)
  tank: Tank;

  @ApiProperty({ type: () => Outcome })
  @ManyToOne(() => Outcome, (outcome) => outcome.fuelHolder)
  outcome: Outcome;

  @ApiProperty({ type: () => Supply })
  @ManyToOne(() => Supply, (supply) => supply.fuelHolder)
  supply: Supply;
}
