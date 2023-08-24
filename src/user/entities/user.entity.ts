import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Event } from '../../event/entities/event.entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { RoleType } from '../enums';
import { EncryptionService } from '../../auth/services/encryption.service';

const crypto = new EncryptionService();

@Entity()
export class User extends CommonEntity {
  @ApiProperty({ description: 'Роль пользователя' })
  @Column({
    type: 'text',
    enum: RoleType,
    default: RoleType.OPERATOR,
  })
  role: RoleType;

  @ApiProperty({ description: 'Логин' })
  @Column({ type: 'varchar', nullable: false })
  login: string;

  @ApiProperty({ description: 'Пароль' })
  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @ApiProperty({ description: 'jwt refresh токен' })
  @Column({ type: 'varchar', nullable: true, select: false })
  refreshToken?: string;

  @ApiPropertyOptional({ default: true, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @ApiProperty({
    type: () => Event,
    isArray: true,
    description: 'Связное событие',
  })
  @OneToMany(() => Event, (event) => event.user)
  event: Event[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await crypto.hash(this.password);
  }
}
