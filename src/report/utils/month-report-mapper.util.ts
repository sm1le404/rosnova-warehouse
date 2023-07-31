import { dateFormatter, timeFormatter } from './date-formatter.util';
import { Operation } from '../../operations/entities/operation.entity';
import { IVehicleTank } from '../../vehicle/types';

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
  'vehicleState.weight',
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
      if (key.includes('vehicleState.density')) {
        const vehicleState =
          operation.vehicleState ?? JSON.parse(operation.vehicleState);
        if (vehicleState) {
          /* eslint-disable no-param-reassign */
          return vehicleState.reduce(
            (acc: number, item: IVehicleTank) => (acc += item.density ?? 0),
            0,
          );
          /*eslint-disable-line no-param-reassign*/
        }
        return '';
      }
      if (key.includes('vehicleState.temperature')) {
        const vehicleState =
          operation.vehicleState ?? JSON.parse(operation.vehicleState);
        if (vehicleState) {
          /*eslint-disable-line no-param-reassign*/
          return vehicleState.reduce(
            (acc: number, item: IVehicleTank) => (acc += item.temperature ?? 0),
            0,
          );
          /* eslint-disable no-param-reassign */
        }
        return '';
      }
      if (key.includes('vehicleState.weight')) {
        const vehicleState =
          operation.vehicleState ?? JSON.parse(operation.vehicleState);
        if (vehicleState) {
          /*eslint-disable-line no-param-reassign*/
          return vehicleState.reduce(
            (acc: number, item: IVehicleTank) => (acc += item.weight ?? 0),
            0,
          );
          /* eslint-disable no-param-reassign */
        }
        return '';
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
