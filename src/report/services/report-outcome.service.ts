import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { Operation } from '../../operations/entities/operation.entity';
import { Between, Repository } from 'typeorm';
import { OperationType } from '../../operations/enums';
import path from 'path';
import { GetByShiftAndDate } from '../types';
import {
  dateFormatter,
  findDispenserIndices,
  getTimestampRange,
  outcomeReportMapper,
} from '../utils';

@Injectable()
export class ReportOutcomeService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  async generate({
    shiftId,
    date,
  }: GetByShiftAndDate): Promise<ExcelJS.Workbook> {
    const rangeTime = getTimestampRange(date);
    const formattedDate = dateFormatter(new Date(date));

    const operations = await this.operationRepository.find({
      where: {
        type: OperationType.OUTCOME,
        shift: { id: shiftId },
        createdAt: Between(rangeTime.start, rangeTime.end),
      },
      order: {
        dispenser: {
          id: 'ASC',
        },
        createdAt: 'ASC',
      },
    });

    const reportRows = outcomeReportMapper(operations);
    const indices = findDispenserIndices(operations).slice(1);

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      const elementToAdd = operations[index].dispenser?.id
        ? `${operations[index].dispenser.id} трк`
        : '';

      reportRows.splice(index, 0, ['', elementToAdd]);
    }

    reportRows.unshift([
      formattedDate,
      operations[0].dispenser?.id ? `${operations[0].dispenser.id} трк` : '',
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(process.cwd(), 'src/assets/outcome-dayreport-template.xlsx'),
    );
    const worksheet = workbook.getWorksheet('page');
    worksheet.name = formattedDate;
    worksheet.addRows(reportRows);
    return workbook;
  }
}
