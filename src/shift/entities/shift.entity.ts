import { AfterLoad, Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Event } from '../../event/entities/event.entity';
import { Operation } from '../../operations/entities/operation.entity';
import { DispenserSummaryInterface } from '../interfaces/dispenser.summary.interface';
import { TankSummaryInterface } from '../interfaces/tank.summary.interface';
import { TankSummaryManualInterface } from '../interfaces/tank.summary.manual.interface';

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
    type: () => DispenserSummaryInterface,
    required: true,
    description: 'Объект, содержащий номер и состояние колонок в начале смены',
    isArray: true,
  })
  @Column({ type: 'text', nullable: true })
  startDispensersState?: string;

  @ApiProperty({
    type: () => DispenserSummaryInterface,
    required: true,
    description: 'Объект, содержащий номер и состояние колонок в конце смены',
    isArray: true,
  })
  @Column({ type: 'text', nullable: true })
  finishDispensersState?: string;

  @ApiProperty({
    type: () => TankSummaryInterface,
    required: true,
    description:
      'Объект, содержащий номер и состояние резевуаров в конце смены',
    isArray: true,
  })
  @Column({ type: 'text', nullable: true })
  finishTankState?: string;

  @ApiProperty({
    type: () => TankSummaryManualInterface,
    required: true,
    description:
      'Объект, содержащий номер и состояние резевуаров в конце смены при ручных замераз',
    isArray: true,
  })
  @Column({ type: 'text', nullable: true })
  manualTankState?: string;

  @AfterLoad()
  afterLoad() {
    if (this?.startDispensersState) {
      try {
        this.startDispensersState = JSON.parse(this.startDispensersState);
      } catch (e) {
        this.startDispensersState = null;
      }
    }
    if (this?.finishDispensersState) {
      try {
        this.finishDispensersState = JSON.parse(this.finishDispensersState);
      } catch (e) {
        this.finishDispensersState = null;
      }
    }

    if (this?.finishTankState) {
      try {
        this.finishTankState = JSON.parse(this.finishTankState);
      } catch (e) {
        this.finishTankState = null;
      }
    }

    if (this?.manualTankState) {
      try {
        this.manualTankState = JSON.parse(this.manualTankState);
      } catch (e) {
        this.manualTankState = null;
      }
    }
  }
}
