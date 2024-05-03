import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class DeleteOperationDto {
  @ApiProperty({ description: 'Комментарий' })
  @IsString()
  @MinLength(20, {
    message: 'Необходим комментарий длиной не менее 20 символов',
  })
  comment: string;
}
