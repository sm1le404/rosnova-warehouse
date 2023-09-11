import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class KafkaMessage extends CommonEntity {
  @ApiProperty({
    required: true,
    description: 'Данные для отправки',
  })
  @Column({ type: 'text', nullable: false })
  data: string;
}
