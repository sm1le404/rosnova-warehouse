import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SettingsKey } from '../enums';

export class CreateSettingDto {
  @ApiProperty({
    required: true,
    description: 'Ключ параметра',
    enum: SettingsKey,
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ required: true, description: 'Значение' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
