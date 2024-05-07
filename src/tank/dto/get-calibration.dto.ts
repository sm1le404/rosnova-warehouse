import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindOptionsOrderValue } from 'typeorm/find-options/FindOptionsOrder';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum SortEx {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetCalibrationDto {
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: true, description: 'Идентификатор резевруара' })
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  tankId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: false, description: 'Объем' })
  @IsOptional()
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  volume?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: false, description: 'Уровень' })
  @IsOptional()
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  level?: number;

  @ApiProperty({
    required: false,
    description: 'Сортировка по уровню, по дефолту desc',
    enum: SortEx,
  })
  @IsEnum(SortEx, {
    message: i18nValidationMessage('validation.IsEnum'),
  })
  @IsOptional()
  sortByVolume?: FindOptionsOrderValue;
}
