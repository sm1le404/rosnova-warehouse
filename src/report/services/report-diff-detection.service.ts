import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import path from 'path';
import { GetDiffDetectionDto } from '../dto/get-diff-detection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { Between, In, Repository } from 'typeorm';
import { OperationStatus, OperationType } from '../../operations/enums';
import { dateFormatter, getDriverFullName, timeFormatter } from '../utils';

@Injectable()
export class ReportDiffDetectionService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  async generate({
    dateStart,
    dateEnd,
    fuelHolderId,
  }: GetDiffDetectionDto): Promise<ExcelJS.Workbook> {
    const operations = await this.operationRepository.find({
      select: {
        id: true,
        finishedAt: true,
        docVolume: true,
        factVolume: true,
        destination: true,
        vehicle: {
          id: true,
          regNumber: true,
        },
        driver: {
          id: true,
          lastName: true,
          firstName: true,
          middleName: true,
        },
        fuel: {
          id: true,
          fullName: true,
        },
        fuelHolder: {
          id: true,
          fullName: true,
        },
      },
      where: {
        type: OperationType.OUTCOME,
        status: OperationStatus.FINISHED,
        destination: In(['АТЗ', 'атз']),
        finishedAt: Between(dateStart, dateEnd),
        ...(fuelHolderId && { fuelHolder: { id: fuelHolderId } }),
      },
      relations: {
        driver: true,
        vehicle: true,
        fuelHolder: true,
        fuel: true,
      },
      relationLoadStrategy: 'query',
      loadEagerRelations: false,
    });

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(
        __dirname,
        '..',
        '..',
        'assets',
        'diff-detection-template.xlsx',
      ),
    );
    const worksheet = workbook.getWorksheet('page');
    const startPosition = 2;

    operations
      .filter((op) => op.factVolume !== op.docVolume)
      .sort((a, b) => a.driver?.lastName.localeCompare(b.driver?.lastName))
      .forEach((op, i) => {
        const date = dateFormatter(op.finishedAt);
        const time = timeFormatter(new Date(op.finishedAt));

        worksheet.getCell(`A${startPosition + i}`).value = `${date} ${time}`;
        worksheet.getCell(`B${startPosition + i}`).value = `${getDriverFullName(
          op.driver,
        )}`;
        worksheet.getCell(
          `C${startPosition + i}`,
        ).value = `${op.vehicle?.regNumber}`;
        worksheet.getCell(
          `D${startPosition + i}`,
        ).value = `${op.fuel.fullName}`;
        worksheet.getCell(
          `E${startPosition + i}`,
        ).value = `${op.fuelHolder.fullName}`;
        worksheet.getCell(`F${startPosition + i}`).value = `${op.factVolume}`;
        worksheet.getCell(`G${startPosition + i}`).value = `${op.docVolume}`;
        worksheet.getCell(`H${startPosition + i}`).value = `${
          op.factVolume - op.docVolume
        }`;
        worksheet.getCell(
          `I${startPosition + i}`,
        ).value = `${op.destination?.toUpperCase()}`;
      });

    return workbook;
  }
}
