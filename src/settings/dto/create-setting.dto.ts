import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SettingsKey } from '../enums';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateSettingDto {
  @ApiProperty({
    required: true,
    description: 'Ключ параметра',
    enum: SettingsKey,
  })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  key: string;

  @ApiProperty({ required: true, description: 'Значение' })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  value: string;
}
