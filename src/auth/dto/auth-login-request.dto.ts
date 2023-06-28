import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginRequestDto {
  @ApiProperty({ required: true, description: 'Логин пользователя' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ required: true, description: 'Пароль пользователя' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
