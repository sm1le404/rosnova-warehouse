import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFuelDto {
  @ApiProperty({ required: true, description: 'Название' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
