import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateOperationDto } from '.';
import { IsEnum, IsOptional } from 'class-validator';
import { OperationStatus } from '../enums';

export class UpdateOperationDto extends PartialType(
  OmitType(CreateOperationDto, ['volumeBefore', 'volumeAfter']),
) {
  @ApiProperty({
    required: false,
    description: 'Статус операции',
    enum: OperationStatus,
  })
  @IsOptional()
  @IsEnum(OperationStatus)
  status?: OperationStatus;
}
