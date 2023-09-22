import { ApiProperty } from '@nestjs/swagger';

export class GetMx1Dto {
  @ApiProperty({
    required: false,
    description: 'Фильтрация по смене',
  })
  shiftId?: number;

  @ApiProperty({
    required: false,
    description: 'Владелец топлива (id)',
  })
  fuelHolderId?: number;

  @ApiProperty({
    required: false,
    description: 'Операция (id)',
  })
  operationId?: number;
}
