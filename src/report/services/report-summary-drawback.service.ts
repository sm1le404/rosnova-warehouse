import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import path from 'path';
import { dateFormatter, timeFormatter, valueRound } from '../utils';
import { GetSummaryDrawbackReportDto } from '../dto/get-summary-drawback-report.dto';
import { getDriverFullName } from '../utils';
import { IVehicleTank } from '../../vehicle/types';

@Injectable()
export class ReportSummaryDrawbackService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  async generate({
    dateStart,
    dateEnd,
  }: GetSummaryDrawbackReportDto): Promise<ExcelJS.Workbook> {
    const docDate = dateFormatter(dateStart, dateEnd);
    const startPosition = 5;

    const operations = await this.operationRepository
      .createQueryBuilder('op')
      .leftJoinAndSelect('op.driver', 'driver')
      .leftJoinAndSelect('op.vehicle', 'vehicle')
      .leftJoinAndSelect('op.trailer', 'trailer')
      .select([
        'op.id',
        'op.docVolume',
        'op.docDensity',
        'op.docWeight',
        'op.factVolume',
        'op.finishedAt',
        'op.vehicleState',
        'trailer.sectionVolumes',
        'trailer.id',
        'driver.id',
        'driver.lastName',
        'driver.firstName',
        'driver.middleName',
      ])
      .where('op.docVolume != op.factVolume')
      .andWhere(`op.finishedAt BETWEEN ${dateStart} AND ${dateEnd}`)
      .andWhere(`op.type == 'supply' OR op.type == 'mixed'`)
      .getMany();

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(
        __dirname,
        '..',
        '..',
        'assets',
        'summary-drawback-template.xlsx',
      ),
    );

    const worksheet = workbook.getWorksheet('page');

    worksheet.getCell('A2').value = docDate;

    operations.forEach((operation, i) => {
      const dateOperation = dateFormatter(operation.finishedAt);
      const timeOperation = timeFormatter(
        new Date(operation.finishedAt * 1000),
      );
      const fullDate = `${dateOperation} ${timeOperation}`;

      const vehicleState = operation.vehicleState as unknown as IVehicleTank[];

      if (operation.vehicle?.trailer?.sectionVolumes) {
        vehicleState.push(
          ...(operation.vehicle?.trailer
            ?.sectionVolumes as unknown as IVehicleTank[]),
        );
      }

      const filteredState = vehicleState.filter((state) => state.maxVolume > 0);

      const averageFactVolume = valueRound(
        filteredState.reduce(
          // eslint-disable-next-line no-param-reassign
          (acc, state) => (acc += state?.maxVolume ?? 0),
          0,
        ),
      );

      const averageFactDensity = valueRound(
        filteredState.reduce(
          // eslint-disable-next-line no-param-reassign
          (acc, state) => (acc += state?.density ?? 0),
          0,
        ) / filteredState.length,
        4,
      );
      const averageFactTemperature = valueRound(
        filteredState.reduce(
          // eslint-disable-next-line no-param-reassign
          (acc, state) => (acc += state?.temperature ?? 0),
          0,
        ) / filteredState.length,
      );

      const docDensity = operation.docDensity ?? 0;

      worksheet.getCell(`A${startPosition + i}`).value = fullDate;

      worksheet.getCell(`B${startPosition + i}`).value = `${getDriverFullName(
        operation.driver,
      )}`;

      worksheet.getCell(`C${startPosition + i}`).value = averageFactVolume;

      worksheet.getCell(`D${startPosition + i}`).value = averageFactDensity;

      worksheet.getCell(`E${startPosition + i}`).value = !isNaN(
        averageFactTemperature,
      )
        ? averageFactTemperature
        : 0;

      worksheet.getCell(`G${startPosition + i}`).value = valueRound(
        averageFactVolume * docDensity,
      );

      const volumeOfFactDensity = valueRound(
        (averageFactVolume * docDensity) / averageFactDensity,
      );

      worksheet.getCell(`H${startPosition + i}`).value = volumeOfFactDensity;

      const volumeTolerance =
        averageFactVolume - volumeOfFactDensity < 0
          ? 0
          : valueRound(averageFactVolume - volumeOfFactDensity);

      worksheet.getCell(`I${startPosition + i}`).value = volumeTolerance;

      const plankVolume = valueRound(
        filteredState.reduce((acc, state) => {
          if (typeof state?.volume === 'string') {
            // eslint-disable-next-line no-param-reassign
            acc += +state?.volume ?? 0;
            return acc;
          }
          // eslint-disable-next-line no-param-reassign
          acc += state?.volume ?? 0;
          return acc;
        }, 0),
      );

      worksheet.getCell(`J${startPosition + i}`).value = plankVolume;

      worksheet.getCell(`K${startPosition + i}`).value =
        averageFactVolume - plankVolume;

      worksheet.getCell(`L${startPosition + i}`).value = valueRound(
        operation.docWeight * (0.65 / 100),
      );

      worksheet.getCell(`M${startPosition + i}`).value = valueRound(
        operation.docWeight * (0.0004 / 100),
      );

      worksheet.getCell(`N${startPosition + i}`).value = valueRound(
        operation.docWeight * (0.6504 / 100),
      );

      worksheet.getCell(`O${startPosition + i}`).value =
        volumeTolerance - plankVolume;

      worksheet.getCell(`P${startPosition + i}`).value = valueRound(
        (volumeTolerance - plankVolume) * averageFactDensity,
      );

      const diff = valueRound(
        operation.docWeight * (0.6504 / 100) -
          (volumeTolerance - plankVolume) * averageFactDensity,
      );

      worksheet.getCell(`Q${startPosition + i}`).value = diff;
      if (diff < 0) {
        worksheet.getCell(`Q${startPosition + i}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: 'fff0847d',
          },
        };
      } else {
        worksheet.getCell(`Q${startPosition + i}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: 'ff8df7a9',
          },
        };
      }
    });

    return workbook;
  }
}
