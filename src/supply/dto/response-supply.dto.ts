import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '../../common/classes/paginated-response';
import { PaginatedMeta } from '../../common/classes/paginated-meta';
import { Supply } from '../entities/supply.entity';

export class ResponseSupplyDto extends PaginatedResponse<Supply> {
  @ApiProperty({ type: Supply, isArray: true, description: 'Приход' })
  data: Supply[];

  @ApiProperty({ description: 'Мета данные запроса' })
  meta: PaginatedMeta<Supply>;
}
