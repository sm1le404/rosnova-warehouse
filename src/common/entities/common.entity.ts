import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

export class CommonEntity extends BaseEntity {
  @ApiProperty({ description: 'Идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания' })
  @CreateDateColumn({ type: 'int' })
  createdAt: number;

  @ApiProperty({ description: 'Дата удаления' })
  @UpdateDateColumn({ type: 'int' })
  updatedAt: number;

  @DeleteDateColumn({ type: 'int', nullable: true, select: false })
  deletedAt: number;

  constructor(partial: Partial<CommonEntity>) {
    super();
    Object.assign(this, partial);
  }
}
