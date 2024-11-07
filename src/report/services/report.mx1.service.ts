import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Workbook } from 'exceljs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { OperationType } from '../../operations/enums';
import { GetMx1Dto } from '../dto/get-mx1.dto';
// eslint-disable-next-line import/no-extraneous-dependencies
import date from 'date-and-time';
import { SettingsService } from '../../settings/services/settings.service';
import { ICurrentUser } from '../../auth/interface/current-user.interface';
import { SettingsKey } from '../../settings/enums';
import { valueRound } from '../../common/utility';

@Injectable()
export class ReportMx1Service {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
    private settingsService: SettingsService,
  ) {}

  async generate(payload: GetMx1Dto, user: ICurrentUser): Promise<Workbook> {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(__dirname, '..', '..', 'assets', 'mx-1-template.xlsx'),
    );
    const page1 = workbook.getWorksheet('стр1');
    const page2 = workbook.getWorksheet('стр2');

    const filter: FindOptionsWhere<Operation> = {
      type: In([OperationType.SUPPLY, OperationType.MIXED]),
    };

    if (payload.operationId) {
      filter.id = payload.operationId;
    }

    if (payload.shiftId) {
      filter.shift = {
        id: payload.shiftId,
      };
    }

    if (payload.fuelHolderId) {
      filter.fuelHolder = {
        id: payload.fuelHolderId,
      };
    }

    const data = await this.operationRepository.find({
      where: filter,
      relations: {
        fuel: true,
        fuelHolder: true,
        refinery: true,
        shift: true,
      },
    });
    if (data.length === 0) {
      throw new BadRequestException(
        `За выбранный период отсутствуют операции хранения`,
      );
    }

    page1.getCell('C6').value =
      (await this.settingsService.getValue(SettingsKey.STORE_REQUISITES)) ?? '';

    // Владелец топлива
    page1.getCell('C10').value = data[0]?.fuelHolder?.requisites ?? '';

    // Номер акта
    page1.getCell('G18').value = data[0].numberTTN ?? '';

    // Дата составления
    page1.getCell('O18').value = date.format(
      new Date(data[0].shift.createdAt * 1000),
      'DD.MM.YYYY',
    );

    const fistPageStart = 29;
    const secondPageStart = 7;

    let number = 0;
    let firstPageWeight = 0;
    let secondPageWeight = 0;

    data.forEach((item) => {
      const weightDiff = item.docWeight - item.factWeight;
      let realWeight = item.docWeight;
      if (item.docWeight * 0.0065 < weightDiff && item.factWeight > 0) {
        realWeight = realWeight - (weightDiff - item.docWeight * 0.0065);
      }
      realWeight = valueRound(realWeight / 1000, 3);

      let worksheet = page1;
      let startPosition = fistPageStart;
      if (number > 20) {
        worksheet = page2;
        startPosition = secondPageStart;
        secondPageWeight += realWeight;
      } else {
        firstPageWeight += realWeight;
      }

      worksheet.getCell(`B${startPosition + number}`).value = number + 1;
      worksheet.getCell(
        `C${startPosition + number}`,
      ).value = `${item.fuel?.fullName} ${item.refinery?.shortName}`;
      worksheet.getCell(`G${startPosition + number}`).value = `т`;
      worksheet.getCell(`I${startPosition + number}`).value = `168`;
      worksheet.getCell(`L${startPosition + number}`).value = `${valueRound(
        realWeight,
        3,
      )}`;
      worksheet.getCell(`P${startPosition + number}`).value = `0`;

      number++;
    });

    page1.getCell(`L49`).value = valueRound(firstPageWeight, 3);
    if (secondPageWeight > 0) {
      page2.getCell(`N28`).value = valueRound(secondPageWeight, 3);
    }
    page2.getCell(`N29`).value = valueRound(
      firstPageWeight + secondPageWeight,
      3,
    );

    // ФИО оператора
    page2.getCell(`D40`).value = 'Оператор';
    page2.getCell(`L40`).value = user?.login ?? '';

    return workbook;
  }
}
