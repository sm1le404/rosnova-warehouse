import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFuelHolderDto {
  @ApiProperty({ required: false, description: 'Название' })
  @IsString()
  fullName: string;

  @ApiProperty({ required: false, description: 'Короткое имя' })
  @IsString()
  shortName: string;

  @ApiProperty({ required: false, description: 'Включено' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
