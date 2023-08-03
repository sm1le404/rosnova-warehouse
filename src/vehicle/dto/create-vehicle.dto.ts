import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from '../enums';
import { Transform } from 'class-transformer';
import { Driver } from '../../driver/entities/driver.entity';
import { Trailer } from '../entities/trailer.entity';

export class CreateVehicleDto {
  @ApiProperty({ type: Number, required: false, description: 'Водитель' })
  @IsOptional()
  @Transform(({ value }) => (value ? { id: +value } : null))
  driver?: Pick<Driver, 'id'>;

  @ApiProperty({ type: Number, required: false, description: 'Прицеп' })
  @IsOptional()
  @Transform(({ value }) => (value ? { id: +value } : null))
  trailer?: Pick<Trailer, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Тип ТС',
    enum: VehicleType,
  })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ required: true, description: 'Модель ТС' })
  @IsNotEmpty()
  @IsString()
  carModel: string;

  @ApiProperty({ required: true, description: 'Регистрационный номер ТС' })
  @IsNotEmpty()
  @IsString()
  regNumber: string;

  @ApiProperty({ required: false, description: 'Доступность', default: true })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
