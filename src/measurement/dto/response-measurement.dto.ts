import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '../../common/classes/paginated-response';
import { PaginatedMeta } from '../../common/classes/paginated-meta';
import { Measurement } from '../entities/measurement.entity';

export class ResponseMeasurementDto extends PaginatedResponse<Measurement> {
  @ApiProperty({ type: Measurement, isArray: true, description: 'Измерения' })
  data: Measurement[];

  @ApiProperty({ description: 'Мета данные запроса' })
  meta: PaginatedMeta<Measurement>;
}
