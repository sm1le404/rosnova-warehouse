import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PaginationDto implements PaginateQuery {
  static readonly maxLimit: number = 1000;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: 'Номер страницы' })
  page?: number;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'Ограничение эелементов на страницу',
  })
  limit?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: 'Поиск' })
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ description: 'Поиск' })
  searchBy?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    example: 'id:ASC',
    description: 'Сортировка',
  })
  sortBy?: [string, string][];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    example: 'filter.id=$in:1,2,3',
    description: 'Фильтрация',
  })
  filter?: {
    [column: string]: string | string[];
  };

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  path: string | null;
}
