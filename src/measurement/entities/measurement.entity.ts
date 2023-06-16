import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class Measurement extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  volume: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  weight: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  density: number;

  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  level: number;
}
