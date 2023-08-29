import { ApiProperty } from '@nestjs/swagger';
import { TankSummaryManualInterface } from '../interfaces/tank.summary.manual.interface';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CloseShiftDto {
  @ApiProperty({ type: () => TankSummaryManualInterface, isArray: true })
  @IsArray()
  @IsNotEmpty()
  manualMeasurements: TankSummaryManualInterface[];
}
