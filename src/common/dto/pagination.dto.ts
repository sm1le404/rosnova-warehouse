import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PaginationDto implements PaginateQuery {
  static readonly maxLimit: number = 1000;

  @IsOptional()
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @ApiPropertyOptional({ description: 'Номер страницы' })
  page?: number;

  @IsOptional()
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @ApiPropertyOptional({
    description: 'Ограничение элементов на страницу',
  })
  limit?: number;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  @ApiPropertyOptional({ description: 'Поиск' })
  search?: string;

  @IsOptional()
  @IsArray({
    message: i18nValidationMessage('validation.IsArray'),
  })
  @IsString({
    each: true,
    message: i18nValidationMessage('validation.IsString'),
  })
  @ApiPropertyOptional({ description: 'Поиск' })
  searchBy?: string[];

  @IsOptional()
  @IsArray({
    message: i18nValidationMessage('validation.IsArray'),
  })
  @IsString({
    each: true,
    message: i18nValidationMessage('validation.IsString'),
  })
  @ApiPropertyOptional({
    example: 'id:ASC',
    description: 'Сортировка',
  })
  sortBy?: [string, string][];

  @IsOptional()
  @IsArray({
    message: i18nValidationMessage('validation.IsArray'),
  })
  @IsString({
    each: true,
    message: i18nValidationMessage('validation.IsString'),
  })
  @ApiPropertyOptional({
    example: 'filter.id=$in:1,2,3',
    description: 'Фильтрация',
  })
  filter?: {
    [column: string]: string | string[];
  };

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  @ApiHideProperty()
  path: string | null;
}
