import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({ required: true, description: 'Фамилия' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: true, description: 'Имя' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: false, description: 'Отчество' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
