import { Column, Entity } from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class Driver extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', nullable: true })
  middleName: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;
}
