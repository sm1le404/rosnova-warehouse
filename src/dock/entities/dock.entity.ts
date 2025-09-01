import { Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Operation } from '../../operations/entities/operation.entity';

@Entity()
export class Dock extends CommonEntity {
  @ApiProperty({ required: true, description: 'Полное наименование' })
  @Column({ type: 'varchar', nullable: false })
  fullName: string;

  @ApiProperty({ required: false, description: 'Краткое наименование' })
  @Column({ type: 'varchar', nullable: true })
  shortName?: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @OneToMany(() => Operation, (operation) => operation.dock)
  operation?: Operation[];
}
