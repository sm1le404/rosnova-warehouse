import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AuthLoginRequestDto {
  @ApiProperty({ required: true, description: 'Логин пользователя' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  login: string;

  @ApiProperty({ required: true, description: 'Пароль пользователя' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  password: string;
}
