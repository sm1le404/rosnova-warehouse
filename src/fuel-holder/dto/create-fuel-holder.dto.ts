import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFuelHolderDto {
  @ApiProperty({ required: true, description: 'Полное наименование' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ required: false, description: 'Краткое наименование' })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiProperty({ required: false, description: 'ИНН' })
  @IsOptional()
  @IsString()
  inn?: string;
}
