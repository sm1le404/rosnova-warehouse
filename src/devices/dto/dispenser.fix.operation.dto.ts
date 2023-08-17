import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DispenserFixOperationDto {
  @ApiProperty({ description: 'Идентификатор операции' })
  @IsInt()
  operationId: number;
}
