import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { Operation } from '../../operations/entities/operation.entity';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { OperationType } from '../../operations/enums';
import path from 'path';
import { monthReportMapper } from '../utils';
import { GetMonthReportDto } from '../dto/get-month-report.dto';

@Injectable()
export class ReportFilteredService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  async generate({
    shiftId,
    dateStart,
    dateEnd,
  }: GetMonthReportDto): Promise<ExcelJS.Workbook> {
    const filter: FindOptionsWhere<Operation> = {
      type: OperationType.OUTCOME,
    };

    if (shiftId) {
      filter.shift = { id: shiftId };
    }

    if (dateStart && dateEnd) {
      filter.startedAt = Between(dateStart, dateEnd);
    } else if (dateStart) {
      filter.startedAt = MoreThanOrEqual(dateStart);
    } else if (dateEnd) {
      filter.startedAt = LessThanOrEqual(dateEnd);
    }

    const operations = await this.operationRepository.find({
      where: filter,
      order: {
        fuel: {
          id: 'ASC',
        },
        fuelHolder: {
          id: 'ASC',
        },
        refinery: {
          id: 'ASC',
        },
        createdAt: 'ASC',
      },
    });

    const reportRows = monthReportMapper(operations);

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(
        process.cwd(),
        'src/assets/filtered-month-report-template.xlsx',
      ),
    );

    for (const i in operations) {
      /*eslint-disable*/
      const name = `${operations[i].fuel?.name} ${operations[i].fuelHolder?.shortName} ${operations[i].refinery?.shortName}`;
      let worksheet = workbook.getWorksheet('page');
      if (!worksheet) {
        worksheet = workbook.getWorksheet(name);
        if (!worksheet) {
          worksheet = workbook.addWorksheet(name);
          worksheet.addRow(reportRows[i]);
        }
        worksheet.addRow(reportRows[i]);
      }
      worksheet.name = name;
      worksheet.addRow(reportRows[i]);
    }

    return workbook;
  }
}
