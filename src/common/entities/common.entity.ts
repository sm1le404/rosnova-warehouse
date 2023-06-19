import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

export class CommonEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'int' })
  createdAt: number;

  @ApiProperty()
  @UpdateDateColumn({ type: 'int' })
  updatedAt: number;

  @DeleteDateColumn({ type: 'int', nullable: true, select: false })
  deletedAt: number;

  constructor(partial: Partial<CommonEntity>) {
    super();
    Object.assign(this, partial);
  }
}
