import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class KafkaMessage extends CommonEntity {
  @ApiProperty({ description: 'Идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания' })
  @Column({ type: 'integer', default: () => `strftime('%s', 'now')` })
  createdAt: number;

  @ApiProperty({
    required: true,
    description: 'Данные для отправки',
  })
  @Column({ type: 'text', nullable: false })
  data: string;
}
