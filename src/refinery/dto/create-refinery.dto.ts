import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRefineryDto {
  @ApiProperty({ required: true, description: 'Имя' })
  @IsString()
  fullName: string;

  @ApiProperty({ required: false, description: 'Отчество' })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiProperty({ required: false, description: 'Включено' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
