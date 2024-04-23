import { ApiProperty } from '@nestjs/swagger';

export class DispenserRvSimpleResponseDto {
  @ApiProperty({ description: 'Состояние посылки', required: true })
  success: number;
}
