import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindOptionsOrderValue } from 'typeorm/find-options/FindOptionsOrder';

export enum SortEx {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetCalibrationDto {
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: true, description: 'Идентификатор резевруара' })
  @Min(0)
  tankId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: false, description: 'Объем' })
  @IsOptional()
  @Min(0)
  volume?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: false, description: 'Уровень' })
  @IsOptional()
  @Min(0)
  level?: number;

  @ApiProperty({
    required: false,
    description: 'Сортировка по уровню, по дефолту desc',
    enum: SortEx,
  })
  @IsEnum(SortEx)
  @IsOptional()
  sortByVolume?: FindOptionsOrderValue;
}
