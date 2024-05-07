import { ApiProperty } from '@nestjs/swagger';
import { TankSummaryManualInterface } from '../interfaces/tank.summary.manual.interface';
import { IsArray, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CloseShiftDto {
  @ApiProperty({ type: () => TankSummaryManualInterface, isArray: true })
  @IsArray({
    message: i18nValidationMessage('validation.IsArray'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  manualMeasurements: TankSummaryManualInterface[];
}
