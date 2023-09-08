import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiProperty({ required: true, description: 'Ключ параметра' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ required: true, description: 'Значение' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
