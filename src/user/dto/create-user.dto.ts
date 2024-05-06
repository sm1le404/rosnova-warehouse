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
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @ApiProperty({ description: 'Роль пользователя', enum: RoleType })
  @IsEnum(RoleType, {
    message: i18nValidationMessage('validation.IsEnum'),
  })
  role: RoleType;

  @ApiProperty({ description: 'Логин' })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  login: string;

  @ApiProperty({ description: 'Пароль' })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  password: string;

  @ApiPropertyOptional({ default: true, description: 'Доступность' })
  @IsBoolean({
    message: i18nValidationMessage('validation.IsBoolean'),
  })
  isEnabled?: boolean;

  @ApiProperty({ description: 'ID Карты' })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
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
