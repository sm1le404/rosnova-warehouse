import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsPositive } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {}

export class UpdateManyUserDto extends UpdateUserDto {
  @ApiProperty({ format: 'int', description: 'Идентификатор пользователя' })
  @IsPositive({
    message: i18nValidationMessage('validation.IsPositive'),
  })
  id: number;
}
