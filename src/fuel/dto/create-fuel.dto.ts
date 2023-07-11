import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFuelDto {
  @ApiProperty({ required: true, description: 'Название' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, description: 'Полное название' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
