import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { RoleType } from '../enums';

@Entity()
export class User extends CommonEntity {
  @ApiProperty()
  @Column({
    type: 'text',
    enum: RoleType,
    default: RoleType.USER,
  })
  role: RoleType;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  login: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true, select: false })
  refreshToken?: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;
}
