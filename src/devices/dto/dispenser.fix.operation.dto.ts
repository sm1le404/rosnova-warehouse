import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class DispenserFixOperationDto {
  @ApiProperty({ description: 'Идентификатор операции' })
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  operationId: number;
}
