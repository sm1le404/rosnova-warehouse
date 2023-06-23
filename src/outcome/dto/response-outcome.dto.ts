import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '../../common/classes/paginated-response';
import { PaginatedMeta } from '../../common/classes/paginated-meta';
import { Outcome } from '../entities/outcome.entity';

export class ResponseOutcomeDto extends PaginatedResponse<Outcome> {
  @ApiProperty({ type: Outcome, isArray: true, description: 'Выдача' })
  data: Outcome[];

  @ApiProperty({ description: 'Мета данные запроса' })
  meta: PaginatedMeta<Outcome>;
}
