import { BadRequestException, Injectable } from '@nestjs/common';
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
import { GetOutcomeReportDto } from '../dto/get-outcome-report.dto';
import {
  dateFormatter,
  findDispenserIndices,
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
    dateStart,
    dateEnd,
  }: GetOutcomeReportDto): Promise<ExcelJS.Workbook> {
    const filter: FindOptionsWhere<Operation> = {
      type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
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

    const shiftOpertaion: Record<number, Array<Operation>> = {};

    const operations = await this.operationRepository.find({
      where: filter,
      order: {
        dispenser: {
          id: 'ASC',
        },
        createdAt: 'ASC',
      },
    });

    operations.forEach((item) => {
      if (Array.isArray(shiftOpertaion[item.shift.id])) {
        shiftOpertaion[item.shift.id].push(item);
      } else {
        shiftOpertaion[item.shift.id] = [item];
      }
    });

    if (Object.keys(shiftOpertaion).length === 0) {
      throw new BadRequestException(`Операции для генерации отчета отсутсвуют`);
    }

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(
        __dirname,
        '..',
        '..',
        'assets',
        'outcome-dayreport-template.xlsx',
      ),
    );
    const worksheet = workbook.getWorksheet('page');
    const endColumnIdx = worksheet.columnCount;

    let lastDate;

    Object.keys(shiftOpertaion).forEach((shiftId) => {
      let copySheet = workbook.addWorksheet(`${shiftId}`);
      copySheet.model = worksheet.model;

      const operations = shiftOpertaion[shiftId];
      const reportRows = outcomeReportMapper(operations);
      const indices = findDispenserIndices(operations).slice(1);
      const formattedDate = dateFormatter(operations[0].shift.startedAt);

      const needToFillIndex = [2];

      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        const elementToAdd = operations[index].dispenser?.id
          ? `${operations[index].dispenser.id} трк`
          : '';

        reportRows.splice(index, 0, ['', elementToAdd]);
        needToFillIndex.push(2 + index + 1);
      }

      reportRows.unshift([
        '',
        operations[0]?.dispenser?.id ? `${operations[0].dispenser.id} трк` : '',
      ]);

      copySheet.name =
        lastDate === formattedDate
          ? `Смена ${operations[0]?.shift?.id} ${formattedDate}`
          : formattedDate;
      lastDate = formattedDate;
      copySheet.addRows(reportRows);
      for (const idx of needToFillIndex) {
        const row = copySheet.getRow(idx);
        copySheet.mergeCells(idx, 3, idx, endColumnIdx);
        row.eachCell((cell) => {
          cell.style.fill = {
            type: 'pattern',
            pattern: 'lightGray',
          };
        });
      }

      copySheet.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell({ includeEmpty: false }, (cell) => {
          cell.border = {
            top: {
              style: 'thin',
            },
            left: {
              style: 'thin',
            },
            bottom: {
              style: 'thin',
            },
            right: {
              style: 'thin',
            },
          };
        });
      });
    });

    worksheet.destroy();

    return workbook;
  }
}
