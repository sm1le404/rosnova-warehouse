import { ApiProperty } from '@nestjs/swagger';
import { DispenserRVStatus } from '../enums/dispenser.rv.enum';

export class DispenserRvResponseDto {
  @ApiProperty({
    description: 'Состояние',
    required: false,
    enum: DispenserRVStatus,
  })
  status: DispenserRVStatus;

  @ApiProperty({ description: 'ID ТРК', required: false })
  idTrk: number;

  @ApiProperty({ description: 'ID оператора', required: false })
  idOp?: string;

  @ApiProperty({ description: 'Доза', required: false })
  doseRef?: number;

  @ApiProperty({ description: 'Имя топлива транслит', required: false })
  fuelName?: string;

  @ApiProperty({ description: 'Имя топлива', required: false })
  fuelNameRu?: string;

  @ApiProperty({ description: 'Резервуар', required: false })
  tankNum?: number;
}
