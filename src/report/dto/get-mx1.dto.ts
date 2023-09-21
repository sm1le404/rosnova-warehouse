import { ApiProperty } from '@nestjs/swagger';

export class GetMx1Dto {
  @ApiProperty({
    required: true,
    description: 'Фильтрация по смене',
  })
  shiftId: number;

  @ApiProperty({
    required: true,
    description: 'Владелец топлива (id)',
  })
  fuelHolderId: number;
}
