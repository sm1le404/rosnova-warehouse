/* eslint-disable no-param-reassign */
import { dateFormatter, timeFormatter } from './date-formatter.util';
import { Operation } from '../../operations/entities/operation.entity';
import { IVehicleTank } from '../../vehicle/types';
import * as ExcelJS from 'exceljs';
import { valueRound } from './round-value.util';
import date from 'date-and-time';

const orderOfColumns = [
  'createdAt', // A
  'fuel.name', // B
  'vehicle.regNumber', // C
  'numberTTN', // D
  'dateTTN', // E
  'docVolume', // F
  'docWeight', // G
  'docDensity', // H
  'docTemperature', // I
  'vehicleState.density', // J
  'vehicleState.temperature', // K
  'vehicleState.weight', // L
  '', // M
  'vehicleState.volume', // N
  'topupWeight', // O
  'tank.sortIndex', // P
];

export const getWeightDrawback = (
  vehicleState: IVehicleTank[],
  operation: Operation,
): number => {
  const factVolumeArray = vehicleState.map(
    (state: IVehicleTank) =>
      (state.maxVolume * operation.docDensity) / state.density,
  );

  const toleranceVolumeArray: number[] = vehicleState.map(
    (state: IVehicleTank, i: number) => {
      if (state.maxVolume - factVolumeArray[i] < 0) {
        return 0;
      }
      return state.maxVolume - factVolumeArray[i];
    },
  );

  const volumeDeficitArray = toleranceVolumeArray.map(
    (value, i) => value - vehicleState[i].volume,
  );

  const weightDeficit = volumeDeficitArray
    .map((volume, i) => volume * vehicleState[i].density)
    .reduce((acc, value) => (acc += value), 0);

  const fullTolerance = operation.docWeight * 0.006504;

  return Math.abs(fullTolerance) - Math.abs(weightDeficit);
};

export const monthReportMapper = (operations: Operation[]): string[][] => {
  return operations.map((operation) => {
    return orderOfColumns.map((key) => {
      const vehicleState =
        operation.vehicleState ?? JSON.parse(operation.vehicleState);

      if (key.includes('docDensity')) {
        return valueRound(operation.docDensity, 4);
      }

      if (key.includes('dateTTN')) {
        return date.format(new Date(operation.dateTTN * 1000), 'DD.MM.YYYY');
      }

      if (key.includes('docWeight')) {
        return valueRound(operation.docWeight, 0);
      }

      if (key.includes('docTemperature')) {
        return valueRound(operation.docTemperature, 1);
      }

      if (key.includes('vehicleState.weight')) {
        if (vehicleState) {
          const volume =
            vehicleState.reduce(
              (acc: number, item: IVehicleTank) => (acc += item.volume ?? 0),
              0,
            ) / vehicleState.length;

          const density =
            vehicleState.reduce(
              (acc: number, item: IVehicleTank) => (acc += item.density ?? 0),
              0,
            ) / vehicleState.length;

          return valueRound(operation.docWeight - volume * density, 0);
        }
      }

      if (key.includes('topupWeight')) {
        if (vehicleState) {
          const result = valueRound(
            getWeightDrawback(vehicleState, operation),
            0,
          );

          return isNaN(result) ? 0 : result;
        }
        return '';
      }

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
          const vehicleDensity = vehicleState.reduce(
            (acc: number, item: IVehicleTank) => (acc += item.density ?? 0),
            0,
          );
          return vehicleDensity == 0
            ? vehicleDensity
            : (vehicleDensity / vehicleState.length)
                .toFixed(4)
                .replace(',', '.');
        }
        return '';
      }
      if (key.includes('vehicleState.temperature')) {
        if (vehicleState) {
          const temperature = vehicleState.reduce(
            (acc: number, item: IVehicleTank) => (acc += item.temperature ?? 0),
            0,
          );
          return temperature == 0 || isNaN(temperature)
            ? 0
            : valueRound(temperature / vehicleState.length, 1);
        }
        return '';
      }
      if (key.includes('vehicleState.weight')) {
        if (vehicleState) {
          return valueRound(
            vehicleState.reduce(
              (acc: number, item: IVehicleTank) =>
                (acc += item.volume * item.density ?? 0),
              0,
            ),
            0,
          );
        }
        return '';
      }
      if (key.includes('vehicleState.volume')) {
        if (vehicleState) {
          const averageFactDensity =
            vehicleState.reduce(
              (acc: number, item: IVehicleTank) => (acc += item.density ?? 0),
              0,
            ) / vehicleState.length;

          const weigthDrawback = getWeightDrawback(vehicleState, operation);

          const result = valueRound(weigthDrawback / averageFactDensity, 0);

          return isNaN(result) ? 0 : result;
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
};
