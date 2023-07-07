import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsPositive } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateManyUserDto extends UpdateUserDto {
  @ApiProperty({ format: 'int', description: 'Идентификатор пользователя' })
  @IsPositive()
  id: number;
}
