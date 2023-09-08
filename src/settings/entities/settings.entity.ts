import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class Settings extends CommonEntity {
  @ApiProperty({ required: true, description: 'Ключ параметра' })
  @Column({ type: 'varchar', nullable: false })
  key: string;

  @ApiProperty({ required: true, description: 'Значение' })
  @Column({ type: 'varchar', nullable: false })
  value: string;
}
