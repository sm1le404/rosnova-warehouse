import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateOperationDto } from '.';
import { IsEnum, IsOptional } from 'class-validator';
import { OperationStatus } from '../enums';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateOperationDto extends PartialType(
  OmitType(CreateOperationDto, ['volumeBefore', 'volumeAfter']),
) {
  @ApiProperty({
    required: false,
    description: 'Статус операции',
    enum: OperationStatus,
  })
  @IsOptional()
  @IsEnum(OperationStatus, {
    message: i18nValidationMessage('validation.IsEnum'),
  })
  status?: OperationStatus;
}
