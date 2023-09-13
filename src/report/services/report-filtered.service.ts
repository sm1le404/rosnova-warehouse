import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { Operation } from '../../operations/entities/operation.entity';
import {
  Between,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { OperationType } from '../../operations/enums';
import path from 'path';
import { addFormulas, monthReportMapper } from '../utils';
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
      type: In([OperationType.SUPPLY, OperationType.RETURN]),
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
        __dirname,
        '..',
        '..',
        'assets',
        'filtered-month-report-template.xlsx',
      ),
    );

    for (const i in operations) {
      const shiftCell = Number(i);
      /*eslint-disable*/
      const name = `${operations[i].fuel?.name} ${operations[i].fuelHolder?.shortName} ${operations[i].refinery?.shortName}`;
      let worksheet = workbook.getWorksheet('page');
      if (!worksheet) {
        worksheet = workbook.getWorksheet(name);
        if (!worksheet) {
          const original = workbook.worksheets[0];
          worksheet = workbook.addWorksheet(name);
          for (let i = 1; i <= 2; i++) {
            const sourceRow = original.getRow(i);
            const targetRow = worksheet.addRow(sourceRow.values);
            sourceRow.eachCell(
              { includeEmpty: true },
              (sourceCell, colNumber) => {
                const targetCell = targetRow.getCell(colNumber);
                targetCell.font = { ...sourceCell.font };
                targetCell.alignment = { ...sourceCell.alignment };
                targetCell.border = { ...sourceCell.border };
                targetCell.fill = { ...sourceCell.fill };

                const columnNumber = sourceCell.col;
                const rowNumber = +sourceCell.row;
                
                const columnWidth = original.getColumn(columnNumber).width;
                const rowHeight = original.getRow(rowNumber).height;
                
                worksheet.getColumn(columnNumber).width = columnWidth;
                worksheet.getRow(rowNumber).height = rowHeight;
              },
            );
          }
          worksheet.addRow(reportRows[i]);
          addFormulas(worksheet, shiftCell);
        }
        worksheet.addRow(reportRows[i]);
        addFormulas(worksheet, shiftCell);
      }
      worksheet.name = name;
      worksheet.addRow(reportRows[i]);
      addFormulas(worksheet, shiftCell);
    }

    return workbook;
  }
}
