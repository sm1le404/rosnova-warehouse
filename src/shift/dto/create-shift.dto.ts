import { IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../../event/entities/event.entity';

export class CreateShiftDto {
  startedAt: number;

  @ApiProperty({ required: false, description: 'Закрытие', nullable: true })
  @IsPositive()
  closedAt?: number;

  @ApiProperty({
    type: Array,
    required: false,
    description: 'Событие',
    nullable: true,
  })
  event?: Pick<Event, 'id'>[];
}
