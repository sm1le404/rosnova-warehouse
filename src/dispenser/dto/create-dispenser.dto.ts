import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateDispenserDto {
  @ApiProperty({ required: true, description: '№ Поста' })
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  sortIndex: number;

  @ApiProperty({ required: true, description: 'Текущее значение счётчика' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  currentCounter: number;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('validation.IsBoolean'),
  })
  isEnabled?: boolean;

  @ApiProperty({ required: false, description: 'Адрес на COM порте' })
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  addressId?: number;

  @ApiProperty({ required: false, description: 'COM порт' })
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  comId?: number;

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('validation.IsBoolean'),
  })
  isBlocked?: boolean;
}
