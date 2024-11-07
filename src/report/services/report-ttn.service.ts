import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { In, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { OperationType } from '../../operations/enums';
// eslint-disable-next-line import/no-extraneous-dependencies
import date from 'date-and-time';
// eslint-disable-next-line import/no-extraneous-dependencies
import ru from 'date-and-time/locale/ru';
import { ICurrentUser } from '../../auth/interface/current-user.interface';
import { SettingsKey } from '../../settings/enums';
import { SettingsService } from '../../settings/services/settings.service';

@Injectable()
export class ReportTtnService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
    private settingsService: SettingsService,
  ) {}

  async generate(
    operationId: number,
    user: ICurrentUser,
  ): Promise<ExcelJS.Workbook> {
    const operation = await this.operationRepository.findOneOrFail({
      where: {
        id: operationId,
        type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
      },
    });

    const allOperations = await this.operationRepository.find({
      where: {
        numberTTN: operation.numberTTN,
        type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
      },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(__dirname, '..', '..', 'assets', 'ttn-template.xlsx'),
    );
    const worksheet = workbook.getWorksheet('page');

    let docWeight = 0;
    let docVolume = 0;

    let startPosition = 72;
    allOperations.forEach((item) => {
      if (item.docWeight) {
        docWeight += item.docWeight;
      }
      if (item.docVolume) {
        docVolume += item.docVolume;
      }

      worksheet.getCell('V10').value = operation.fuelHolder?.requisites ?? '';

      worksheet.getCell(`D${startPosition}`).value = 'Секция';
      worksheet.getCell(`AI${startPosition}`).value = 'ТТН';
      worksheet.getCell(`CM${startPosition}`).value = item.docVolume;
      worksheet.getCell(`FU${startPosition}`).value = (
        item.docWeight / 1000
      ).toFixed(3);

      worksheet.getCell(`DC${startPosition}`).value = `${
        item.docDensity
      }, T° = ${item.docTemperature.toFixed(1)}`;

      startPosition++;
    });

    if (docWeight > 0) {
      docWeight = docWeight / 1000;
    }

    //Имя пользователя
    worksheet.getCell('BE35').value = user.login;

    // Номер накладной
    worksheet.getCell('FM6').value = operation.numberTTN ?? 'бн';

    //Данные по операции
    worksheet.getCell('AS17').value = docVolume ?? '';
    worksheet.getCell('EO17').value = docWeight.toFixed(3) ?? '';

    // Владелец топлива
    worksheet.getCell('V8').value =
      (await this.settingsService.getValue(SettingsKey.STORE_REQUISITES)) ?? '';

    // Водитель
    const driverName =
      `${operation.driver?.lastName} ${operation.driver?.firstName?.slice(
        0,
        1,
      )} ${operation.driver?.middleName?.slice(0, 1)}` ?? '';
    worksheet.getCell('FB29').value = driverName;
    worksheet.getCell('L57').value = driverName;
    worksheet.getCell('AA84').value = driverName;

    // Марка автомобиля
    worksheet.getCell('N53').value = operation.vehicle?.carModel ?? '';

    // ГРЗ
    worksheet.getCell('DI53').value = operation.vehicle?.regNumber ?? '';

    // Нейминг топлива
    worksheet.getCell(
      'BU17',
      // eslint-disable-next-line max-len
    ).value = `${operation?.fuel?.fullName} плотность ${
      operation.docDensity
    }, T° = ${operation.docTemperature.toFixed(1)}`;

    const dateParam = new Date(
      (operation.dateTTN ?? operation.createdAt) * 1000,
    );

    date.locale(ru);

    worksheet.getCell('FM7').value = date.format(dateParam, 'DD');
    worksheet.getCell('X50').value = date.format(dateParam, 'DD');
    worksheet.getCell('BE39').value = date.format(dateParam, 'DD');

    worksheet.getCell('FS7').value = date.format(dateParam, 'MM');
    worksheet.getCell('AD50').value = date.format(dateParam, 'MMMM');
    worksheet.getCell('BM39').value = date.format(dateParam, 'MM');

    worksheet.getCell('FZ7').value = date.format(dateParam, 'YY');
    worksheet.getCell('AW50').value = date.format(dateParam, 'YYYY');
    worksheet.getCell('CG39').value = date.format(dateParam, 'YYYY');

    return workbook;
  }
}
