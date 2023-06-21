import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({ required: true, description: 'Имя' })
  @IsString()
  firstName: string;

  @ApiProperty({ required: false, description: 'Отчество' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ required: true, description: 'Отчество' })
  @IsString()
  lastName: string;

  @ApiProperty({ required: false, description: 'Включено' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
