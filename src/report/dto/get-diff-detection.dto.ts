import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetDiffDetectionDto {
  @ApiProperty({
    description: 'Фильтрация по дате операции от',
  })
  dateStart: number;

  @ApiProperty({
    description: 'Фильтрация по дате операции до',
  })
  dateEnd: number;

  @ApiPropertyOptional({
    description: 'Идентификатор собственника топлива',
  })
  fuelHolderId?: number;
}
