import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetQueStateDto {
  @ApiProperty({ description: 'Идентификатор ТРК' })
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  idTrk: number;

  @ApiProperty({ description: 'Статус' })
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  state: number;

  @ApiProperty({ description: 'Выдаваемая доза', required: false })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @IsPositive({
    message: i18nValidationMessage('validation.IsPositive'),
  })
  doseIssCurr?: number;

  @ApiProperty({ description: 'Тескт ошибки', required: false })
  @IsOptional()
  error?: string;
}
