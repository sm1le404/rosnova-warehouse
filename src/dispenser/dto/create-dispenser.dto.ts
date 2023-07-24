import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDispenserDto {
  @ApiProperty({ required: true, description: 'Сортировка' })
  @IsInt()
  @Min(0)
  sortIndex: number;

  @ApiProperty({ required: true, description: 'Текущее значение счётчика' })
  @IsNumber()
  @Min(0)
  currentCounter: number;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiProperty({ required: false, description: 'Адрес на COM порте' })
  @IsOptional()
  @IsInt()
  @Min(0)
  addressId?: number;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;
}
