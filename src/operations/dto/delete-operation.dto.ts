import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class DeleteOperationDto {
  @ApiProperty({ description: 'Комментарий' })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  @MinLength(20, {
    message: 'Необходим комментарий длиной не менее 20 символов',
  })
  comment: string;
}
