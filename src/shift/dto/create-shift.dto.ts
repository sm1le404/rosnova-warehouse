import { IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../../event/entities/event.entity';

export class CreateShiftDto {
  @ApiProperty({ required: true, description: 'Открытие' })
  @IsPositive()
  startedAt: number;

  @ApiProperty({ required: true, description: 'Закрытие' })
  @IsPositive()
  closedAt: number;

  @ApiProperty({ type: Array, required: false, description: 'Событие' })
  event?: Pick<Event, 'id'>[];
}
