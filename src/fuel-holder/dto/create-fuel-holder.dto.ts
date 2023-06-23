import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFuelHolderDto {
  @ApiProperty({ required: true, description: 'Полное название' })
  @IsString()
  fullName: string;

  @ApiProperty({ required: false, description: 'Краткое название' })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
