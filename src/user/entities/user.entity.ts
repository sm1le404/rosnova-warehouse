import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { RoleType } from '../enums';
import { Shift } from '../../shift/entities/shift.entity';
import { EncryptionService } from '../../auth/services/encryption.service';

const crypto = new EncryptionService();

@Entity()
export class User extends CommonEntity {
  @ApiProperty({ description: 'Роль пользователя' })
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

  @ApiProperty({ type: () => Shift, isArray: true })
  @OneToMany(() => Shift, (shift) => shift.user)
  shift: Shift[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await crypto.hash(this.password);
  }
}
