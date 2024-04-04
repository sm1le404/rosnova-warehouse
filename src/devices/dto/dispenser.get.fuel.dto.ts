import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class DispenserGetFuelDto {
  @ApiProperty({ description: 'Идентификатор операции' })
  @IsInt()
  operationId: number;

  @ApiProperty({ description: 'Количество литров к списанию' })
  @IsNumber()
  @Min(1)
  litres: number;

  @IsOptional()
  userId?: number;
}
