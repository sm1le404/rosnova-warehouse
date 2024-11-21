import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Column } from 'typeorm';

export class CreateFuelHolderDto {
  @ApiProperty({ required: true, description: 'Полное наименование' })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  fullName: string;

  @ApiProperty({ required: false, description: 'Краткое наименование' })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  shortName?: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('validation.IsBoolean'),
  })
  isEnabled?: boolean;

  @ApiProperty({ required: false, description: 'ИНН' })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  inn?: string;

  @ApiProperty({ required: false, description: 'Полные реквизиты' })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  requisites?: string;
}
