import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '../../common/classes/paginated-response';
import { PaginatedMeta } from '../../common/classes/paginated-meta';
import { Event } from '../entities/event.entity';

export class ResponseEventDto extends PaginatedResponse<Event> {
  @ApiProperty({ type: Event, isArray: true, description: 'События' })
  data: Event[];

  @ApiProperty({ description: 'Мета данные запроса' })
  meta: PaginatedMeta<Event>;
}
