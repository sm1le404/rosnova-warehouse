import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsPositive } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {}

export class UpdateManyUserDto extends UpdateUserDto {
  @ApiProperty({ format: 'int', description: 'Идентификатор пользователя' })
  @IsPositive()
  id: number;
}
