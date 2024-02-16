import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CommonEntity extends BaseEntity {
  @ApiProperty({ description: 'Идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания' })
  @Column({ type: 'integer', default: () => `strftime('%s', 'now')` })
  createdAt: number;

  @ApiProperty({ description: 'Дата создания ISO' })
  createdAtIso: string;

  @ApiProperty({ description: 'Время создания со сдвигом' })
  createdTzTime?: number;

  @ApiProperty({ description: 'Дата обновления' })
  @Column({
    type: 'integer',
    default: () => `strftime('%s', 'now')`,
  })
  updatedAt: number;

  @ApiProperty({ description: 'Дата обновления ISO' })
  updatedAtIso: string;

  @ApiProperty({ description: 'Время обновления со сдвигом' })
  updatedAtTzTime?: number;

  @DeleteDateColumn({
    nullable: true,
    select: false,
  })
  deletedAt?: number;

  @ApiProperty({ description: 'Дата обновления ISO' })
  deletedAtTzTime: string;

  constructor(partial: Partial<CommonEntity>) {
    super();
    Object.assign(this, partial);
  }
}
