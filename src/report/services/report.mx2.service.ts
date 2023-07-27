import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Workbook } from 'exceljs';
import path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import {
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Between,
  Repository,
} from 'typeorm';
import { GetMx2Dto } from '../dto/get-mx2.dto';
import { OperationType } from '../../operations/enums';
import { formatDate } from '../../common/utility';

@Injectable()
export class ReportMx2Service {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  async generate(payload: GetMx2Dto): Promise<Workbook> {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(__dirname, '..', '..', 'assets', 'mx-2-example.xlsx'),
    );
    const worksheetMain = workbook.getWorksheet('стр2');
    const filter: FindOptionsWhere<Operation> = {
      type: OperationType.SUPPLY,
    };

    if (payload.startedAtTo && payload.startedAtFrom) {
      filter.startedAt = Between(payload.startedAtFrom, payload.startedAtTo);
    } else if (payload.startedAtFrom) {
      filter.startedAt = MoreThanOrEqual(payload.startedAtFrom);
    } else if (payload.startedAtTo) {
      filter.startedAt = LessThanOrEqual(payload.startedAtTo);
    }

    const data = await this.operationRepository.find({
      where: filter,
      relations: {
        fuel: true,
        fuelHolder: true,
        refinery: true,
      },
    });
    if (data.length === 0) {
      throw new BadRequestException(
        `За выбранный период отсувуют операции хранения`,
      );
    }
    let number = 1;
    data.forEach((item) => {
      const startedDateFormatted = formatDate(new Date(item.startedAt * 1000));
      const createdFormatted = formatDate(new Date(item.createdAt * 1000));
      const weightDiff = item.docWeight - item.factWeight;
      let realWeight = item.docWeight;
      if (item.docWeight * 0.0065 < weightDiff) {
        realWeight = realWeight - (weightDiff - item.docWeight * 0.0065);
      }
      worksheetMain.addRow([
        `${number}`,
        `${startedDateFormatted}`,
        `${item.fuelHolder.shortName}`,
        `${item.fuel.name} ${item.refinery.shortName}`,
        `т`,
        `${realWeight}`,
        ``,
        ``,
        `Склад ГСМ ООО "Регион Трейд"`,
        `${item.numberTTN}`,
        `${createdFormatted}`,
        `${createdFormatted}`,
      ]);
      number++;
    });

    return workbook;
  }
}
