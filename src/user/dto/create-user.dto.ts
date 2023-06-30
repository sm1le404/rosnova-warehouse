import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '../enums';

export class CreateUserDto {
  @ApiProperty({ description: 'Роль пользователя' })
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

  @ApiProperty({ default: true, description: 'Доступность' })
  @IsBoolean()
  isEnabled: boolean;
}
