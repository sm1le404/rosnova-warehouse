import { IsBoolean, IsInt, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDispenserDto {
  @ApiProperty({ required: true, description: 'Сортировка' })
  @IsInt()
  sortIndex: number;

  @ApiProperty({ required: true, description: 'Отчество' })
  @IsNumber()
  currentCounter: number;

  @ApiProperty({ required: false, description: 'Включено' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
