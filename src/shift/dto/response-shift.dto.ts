import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '../../common/classes/paginated-response';
import { PaginatedMeta } from '../../common/classes/paginated-meta';
import { Shift } from '../entities/shift.entity';

export class ResponseShiftDto extends PaginatedResponse<Shift> {
  @ApiProperty({ type: Shift, isArray: true, description: 'Смена' })
  data: Shift[];

  @ApiProperty({ description: 'Мета данные запроса' })
  meta: PaginatedMeta<Shift>;
}
