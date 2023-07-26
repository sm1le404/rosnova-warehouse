import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '../../common/classes/paginated-response';
import { PaginatedMeta } from '../../common/classes/paginated-meta';
import { TankHistory } from '../entities/tank-history.entity';

export class ResponseTankHistoryDto extends PaginatedResponse<TankHistory> {
  @ApiProperty({
    type: TankHistory,
    isArray: true,
    description: 'История операций по резервуару',
  })
  data: TankHistory[];

  @ApiProperty({ description: 'Мета данные запроса' })
  meta: PaginatedMeta<TankHistory>;
}
