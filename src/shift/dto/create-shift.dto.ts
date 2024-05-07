import { IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../../event/entities/event.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateShiftDto {
  startedAt: number;

  @ApiProperty({ required: false, description: 'Закрытие', nullable: true })
  @IsPositive({
    message: i18nValidationMessage('validation.IsPositive'),
  })
  closedAt?: number;

  @ApiProperty({
    type: Array,
    required: false,
    description: 'Событие',
    nullable: true,
  })
  event?: Pick<Event, 'id'>[];
}
