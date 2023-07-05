import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiProperty({ description: 'Логин' })
  @Column({ type: 'varchar', nullable: false })
  login: string;

  @ApiProperty({ description: 'Пароль' })
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty({ description: 'jwt refresh токен' })
  @Column({ type: 'varchar', nullable: true, select: false })
  refreshToken?: string;

  @ApiPropertyOptional({ default: true, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @ApiProperty({
    type: () => Shift,
    isArray: true,
    description: 'Связные смены',
  })
  @OneToMany(() => Shift, (shift) => shift.user, { cascade: true })
  shift: Shift[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await crypto.hash(this.password);
  }
}
