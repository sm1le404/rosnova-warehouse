import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
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
    { allowInfinity: false, allowNaN: false },
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  doseIssCurr?: number;

  @ApiProperty({ description: 'Тескт ошибки', required: false })
  @IsOptional()
  error?: string;
}
