import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '../enums';
import { Event } from '../../event/entities/event.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'Роль пользователя', enum: RoleType })
  @IsEnum(RoleType)
  role: RoleType;

  @ApiProperty({ description: 'Логин' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ description: 'Пароль' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ default: true, description: 'Доступность' })
  @IsBoolean()
  isEnabled?: boolean;

  @ApiProperty({ description: 'ID Карты' })
  @IsString()
  @IsOptional()
  cardId?: string;

  @ApiProperty({
    type: Array,
    required: false,
    description: 'Событие',
    nullable: true,
  })
  event?: Pick<Event, 'id'>[];
}
