import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginRequestDto {
  @ApiProperty({ description: 'login' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ description: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
