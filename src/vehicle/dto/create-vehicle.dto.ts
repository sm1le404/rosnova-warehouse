import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CarModelType, VehicleType } from '../enums';
import { Transform } from 'class-transformer';

export class CreateVehicleDto {
  @ApiProperty({ required: true, description: 'Тип ТС', type: VehicleType })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ required: true, description: 'Модель ТС', type: CarModelType })
  @IsEnum(CarModelType)
  carModel: CarModelType;

  @ApiProperty({ required: true, description: 'Регистрационный номер ТС' })
  regNumber: string;

  @ApiProperty({
    required: true,
    description: 'Объект, содержащий номер и объём резервуара',
  })
  @Transform(({ value }) => JSON.stringify(value))
  @IsNotEmpty()
  @IsString()
  tanksVolume: string;

  @ApiProperty({
    required: true,
    description: 'Объект, содержащий номер и калибр резервуара',
  })
  @Transform(({ value }) => JSON.stringify(value))
  @IsNotEmpty()
  @IsString()
  tanksCalibration: string;

  @ApiProperty({ required: true, description: 'Доступность' })
  @IsBoolean()
  isEnabled: boolean;
}
