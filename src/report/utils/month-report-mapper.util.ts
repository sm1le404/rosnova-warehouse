import { dateFormatter, timeFormatter } from './date-formatter.util';
import { Operation } from '../../operations/entities/operation.entity';
import { IVehicleTank } from '../../vehicle/types';
import * as ExcelJS from 'exceljs';

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
  'vehicleState.weight',
  '',
  'vehicleState.volume',
  '',
  'tank.sortIndex',
];

export const monthReportMapper = (operations: Operation[]): string[][] => {
  return operations.map((operation) => {
    return orderOfColumns.map((key) => {
      const vehicleState =
        operation.vehicleState ?? JSON.parse(operation.vehicleState);
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
        if (vehicleState) {
          /* eslint-disable no-param-reassign */
          const vehicleDensity = vehicleState.reduce(
            (acc: number, item: IVehicleTank) => (acc += item.density ?? 0),
            0,
          );
          return vehicleDensity == 0
            ? vehicleDensity
            : (vehicleDensity / vehicleState.length).toFixed(4);
          /*eslint-disable-line no-param-reassign*/
        }
        return '';
      }
      if (key.includes('vehicleState.temperature')) {
        if (vehicleState) {
          /*eslint-disable-line no-param-reassign*/
          const temperature = vehicleState.reduce(
            (acc: number, item: IVehicleTank) => (acc += item.temperature ?? 0),
            0,
          );
          return temperature == 0
            ? temperature
            : (temperature / vehicleState.length).toFixed(2);
          /* eslint-disable no-param-reassign */
        }
        return '';
      }
      if (key.includes('vehicleState.weight')) {
        if (vehicleState) {
          /*eslint-disable-line no-param-reassign*/
          return vehicleState.reduce(
            (acc: number, item: IVehicleTank) =>
              (acc += item.volume * item.density ?? 0),
            0,
          );
          /* eslint-disable no-param-reassign */
        }
        return '';
      }
      if (key.includes('vehicleState.volume')) {
        if (vehicleState) {
          /*eslint-disable-line no-param-reassign*/
          return vehicleState.reduce(
            (acc: number, item: IVehicleTank) => (acc += item.volume ?? 0),
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

export const addFormulas = (
  worksheet: ExcelJS.Worksheet,
  shiftCell: number,
) => {
  worksheet.getCell(`F2`).value = {
    formula: `SUM(F3:F${3 + shiftCell})`,
    date1904: true,
  };
  worksheet.getCell(`G2`).value = {
    formula: `SUM(G3:G${3 + shiftCell})`,
    date1904: true,
  };
  worksheet.getCell(`L2`).value = {
    formula: `SUM(L3:L${3 + shiftCell})`,
    date1904: true,
  };
  worksheet.getCell(`O${3 + shiftCell}`).value = {
    formula: `N${3 + shiftCell}*J${3 + shiftCell}`,
    date1904: true,
  };
};
