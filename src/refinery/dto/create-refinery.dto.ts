import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRefineryDto {
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
}
