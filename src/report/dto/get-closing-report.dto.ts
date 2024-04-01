import { ApiProperty } from '@nestjs/swagger';

export type TankItem = {
  id: number;
  sortIndex: number;
  fuel: { id: number };
  fuelHolder: { id: number };
  refinery: { id: number };
  volume: number;
  weight: number;
  docVolume: number;
  docWeight: number;
};

export type OperationItem = {
  volume: number;
  weight: number;
  docVolume: number;
  docWeight: number;
};

export type MeasurementItem = {
  id: number;
  level: number;
  volume: number;
  weight: number;
  density: number;
};

export class GetClosingReportDto {
  @ApiProperty({ description: 'Данные по резервуару на начало смены' })
  tank: TankItem;

  @ApiProperty({ description: 'Данные по входящих операциям' })
  incomesSum: OperationItem;

  @ApiProperty({ description: 'Данные по исходящим операциям' })
  outcomesSum: OperationItem;

  @ApiProperty({ description: 'Прошлые данные по замерам' })
  oldMeasurement: MeasurementItem;

  @ApiProperty({ description: 'Новые данные по замерам' })
  newMeasurement: MeasurementItem;
}
