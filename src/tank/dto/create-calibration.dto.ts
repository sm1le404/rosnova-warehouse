import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommonId } from '../../common/types/common-id.type';
import { Tank } from '../entities/tank.entity';

export class CreateCalibrationDto {
  @ApiProperty({
    required: false,
    description: 'Связный резервуар',
    type: () => CommonId,
  })
  tank?: Pick<Tank, 'id'>;

  @ApiProperty({ required: false, description: 'Объём', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  volume?: number;

  @ApiProperty({ required: false, description: 'Уровень', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  level?: number;
}
