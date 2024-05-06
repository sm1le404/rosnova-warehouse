import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class DispenserGetFuelDto {
  @ApiProperty({ description: 'Идентификатор операции' })
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  operationId: number;

  @ApiProperty({ description: 'Количество литров к списанию' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(1, {
    message: i18nValidationMessage('validation.Min'),
  })
  litres: number;

  @IsOptional()
  userId?: number;
}
