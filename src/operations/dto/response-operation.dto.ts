import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '../../common/classes/paginated-response';
import { PaginatedMeta } from '../../common/classes/paginated-meta';
import { Operation } from '../entities/operation.entity';

export class ResponseOperationDto extends PaginatedResponse<Operation> {
  @ApiProperty({
    type: () => [Operation],
    isArray: true,
    description: 'Операция',
  })
  data: Operation[];

  @ApiProperty({ description: 'Мета данные запроса' })
  meta: PaginatedMeta<Operation>;
}
