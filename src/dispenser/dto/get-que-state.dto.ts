import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class GetQueStateDto {
  @ApiProperty({ description: 'Идентификатор ТРК' })
  @IsInt()
  idTrk: number;

  @ApiProperty({ description: 'Статус' })
  @IsInt()
  state: number;

  @ApiProperty({ description: 'Выдаваемая доза', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  doseIssCurr?: number;

  @ApiProperty({ description: 'Тескт ошибки', required: false })
  @IsOptional()
  error?: string;
}
