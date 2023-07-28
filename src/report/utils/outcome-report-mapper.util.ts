import { timeFormatter } from './date-formatter.util';
import { Operation } from '../../operations/entities/operation.entity';

const orderOfColumns = [
  'createdAt',
  'tank.sortIndex',
  'counterBefore',
  'counterAfter',
  'docVolume',
  'factVolume',
  'docDensity',
  'docWeight',
  'vehicle.regNumber',
  'numberTTN',
];

export const outcomeReportMapper = (operations: Operation[]): string[][] => {
  return operations.map((operation) => {
    return orderOfColumns.map((key) => {
      if (key.includes('createdAt')) {
        return timeFormatter(new Date(operation[key] * 1000));
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
