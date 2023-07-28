import { dateFormatter, timeFormatter } from './date-formatter.util';
import { Operation } from '../../operations/entities/operation.entity';

const orderOfColumns = [
  'createdAt',
  'fuel.name',
  'vehicle.regNumber',
  'numberTTN',
  'numberTTN',
  'docVolume',
  'docWeight',
  'docDensity',
  'docTemperature',
  'vehicleState.density',
  'vehicleState.temperature',
  'factWeight',
  'factVolume',
  'factVolume',
  'factWeight',
  'tank.sortIndex',
];

export const monthReportMapper = (operations: Operation[]): string[][] => {
  return operations.map((operation) => {
    return orderOfColumns.map((key) => {
      if (key.includes('createdAt')) {
        return (
          dateFormatter(operation[key]) +
          ' ' +
          timeFormatter(new Date(operation[key] * 1000))
        );
      }
      if (key.includes('fuel.name')) {
        return operation.fuel ? operation.fuel.name : '';
      }
      if (key.includes('tank.sortIndex')) {
        return operation.tank ? operation.tank.sortIndex : '';
      }
      if (key.includes('vehicle.regNumber')) {
        return operation.vehicle ? operation.vehicle.regNumber : '';
      }
      return operation[key] ?? '';
    });
  });
};
