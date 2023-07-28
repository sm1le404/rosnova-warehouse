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
    const formattedDate = dateFormatter(dateStart, dateEnd);

    const filter: FindOptionsWhere<Operation> = {
      type: OperationType.OUTCOME,
      shift: { id: shiftId },
    };

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
      operations[0]?.dispenser?.id ? `${operations[0].dispenser.id} трк` : '',
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
