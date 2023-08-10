import { Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Operation } from '../../operations/entities/operation.entity';

@Entity()
export class Dispenser extends CommonEntity {
  @ApiProperty({ required: true, description: 'Сортировка' })
  @Column({ type: 'int', nullable: false })
  sortIndex: number;

  @ApiProperty({ required: true, description: 'Текущее значение счётчика' })
  @Column({ type: 'float', nullable: false })
  currentCounter: number;

  @ApiProperty({ required: false, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @ApiProperty({ required: false, description: 'Блокировка' })
  @Column({ type: 'boolean', default: false })
  isBlocked?: boolean;

  @ApiProperty({ required: true, description: 'COM порт' })
  @Column({ type: 'int', nullable: true })
  comId?: number;

  @ApiProperty({ required: true, description: 'Адрес на COM порте' })
  @Column({ type: 'int', nullable: true })
  addressId?: number;

  @ApiProperty({ required: false, description: 'Ошибка на устройстве' })
  @Column({ type: 'varchar', nullable: true })
  error?: string;

  @OneToMany(() => Operation, (operation) => operation.dispenser)
  operation: Operation[];
}
