import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { dateFormatter, timeFormatter } from '../utils';
import { IVehicleTank } from '../../vehicle/types';
import { ICurrentUser } from '../../auth/interface/current-user.interface';
import { SettingsService } from '../../settings/services/settings.service';
import { SettingsKey } from '../../settings/enums';

@Injectable()
export class ReportDrawbackService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
    private settingsService: SettingsService,
  ) {}

  async generate(
    operationId: number,
    user: ICurrentUser,
  ): Promise<ExcelJS.Workbook> {
    const operation = await this.operationRepository.findOne({
      where: { id: operationId },
    });
    const docDate = dateFormatter(
      Math.floor(
        operation?.dateTTN > 0 ? operation?.dateTTN : operation.createdAt,
      ),
    );
    const dateStart = dateFormatter(operation.startedAt);
    const timeStart = timeFormatter(new Date(operation.startedAt * 1000));
    const dateEnd = dateFormatter(operation.finishedAt);
    const timeEnd = timeFormatter(new Date(operation.finishedAt * 1000));
    const vehicleState = operation.vehicleState as unknown as IVehicleTank[];

    if (operation.vehicle?.trailer?.sectionVolumes) {
      vehicleState.push(
        ...(operation.vehicle?.trailer
          ?.sectionVolumes as unknown as IVehicleTank[]),
      );
    }

    const filteredState = vehicleState.filter((state) => state.maxVolume > 0);

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(__dirname, '..', '..', 'assets', 'drawback-template.xlsx'),
    );

    const worksheet = workbook.getWorksheet('page');
    // Номер накладной
    worksheet.getCell('D1').value =
      `${operation.numberTTN} от ${docDate}` ?? 'бн';
    worksheet.getCell('D32').value = operation.numberTTN ?? 'бн';

    // Тестируемое топливо
    worksheet.getCell('G2:I2').value = operation.fuel?.name;

    // Дата
    worksheet.getCell('B3:C3').value = docDate;
    // Покупатель
    worksheet.getCell('C5:E5').value = operation.fuelHolder?.fullName ?? '';
    // Поставщик
    worksheet.getCell('C8').value = operation.refinery?.fullName ?? '';
    // Место приемки
    worksheet.getCell('E11:G11').value = operation.destination ?? '';

    // Свидетельство о поверке
    const cert = await this.settingsService.getValue(SettingsKey.VER_CERT);
    const certDate = await this.settingsService.getValue(
      SettingsKey.VER_CERT_DATE,
    );
    worksheet.getCell('A20').value = cert
      ? `Свидетельство о поверке ${cert}`
      : '';
    worksheet.getCell('D20').value = cert
      ? `Действительно до ${certDate.split('-').reverse().join('.')} г.`
      : '';

    // Даты начала и конца приемки
    worksheet.getCell('D28:E28').value = dateStart;
    worksheet.getCell('F28').value = timeStart;
    worksheet.getCell('D29:E29').value = dateEnd;
    worksheet.getCell('F29').value = timeEnd;

    // Автомобиль и прицеп
    worksheet.getCell('B30:C30').value = `${
      operation.vehicle?.carModel ?? ''
    } ${operation.vehicle?.regNumber ?? ''}`;
    worksheet.getCell('B31:C31').value = operation.trailer?.regNumber ?? '';

    // Сведения о грузе
    worksheet.getCell('B34').value = operation.docWeight ?? '';
    worksheet.getCell('B35').value = operation.docDensity ?? '';
    worksheet.getCell('B36').value = operation.docTemperature ?? '';

    // Данные по отсекам
    filteredState.map((state, index) => {
      worksheet.getCell(`B${39 + index}`).value = state?.maxVolume ?? '';
    });

    filteredState.map((state, index) => {
      worksheet.getCell(`C${39 + index}`).value = state?.density ?? '';
      worksheet.getCell(`D${39 + index}`).value = state?.temperature ?? '';
      worksheet.getCell(`I${39 + index}`).value = state?.volume ?? '';
    });

    const len = filteredState.length ?? 0;

    // Очистка формы
    worksheet.spliceRows(39 + len, 5 - len);

    // Добавление формул
    worksheet.getCell(`B${39 + len}`).value = {
      formula: `SUM(B39:B${39 + len - 1})`,
      date1904: true,
    };
    worksheet.getCell(`C${39 + len}`).value = {
      formula: `AVERAGE(C39:C${39 + len - 1})`,
      date1904: true,
    };
    worksheet.getCell(`D${39 + len}`).value = {
      formula: `AVERAGE(D39:D${39 + len - 1})`,
      date1904: true,
    };
    worksheet.getCell(`F${39 + len}`).value = {
      formula: `SUM(F39:F${39 + len - 1})`,
      date1904: true,
    };
    worksheet.getCell(`G${39 + len}`).value = {
      formula: `F${39 + len}/C${39 + len}`,
      date1904: true,
    };
    worksheet.getCell(`H${39 + len}`).value = {
      formula: `SUM(H39:H${39 + len - 1})`,
      date1904: true,
    };
    worksheet.getCell(`B${39 + len}`).value = {
      formula: `SUM(B$39:B$${39 + len - 1})`,
      date1904: true,
    };
    worksheet.getCell(`I${39 + len}`).value = {
      formula: `SUM(I39:I${39 + len - 1})`,
      date1904: true,
    };
    worksheet.getCell(`J${39 + len}`).value = {
      formula: `B${39 + len}-I${39 + len}`,
      date1904: true,
    };
    worksheet.getCell(`K${39 + len}`).value = {
      formula: 'B34*K37/100',
      date1904: true,
    };
    worksheet.getCell(`L${39 + len}`).value = {
      formula: 'B34*L37/100',
      date1904: true,
    };
    worksheet.getCell(`M${39 + len}`).value = {
      formula: 'B34*M37/100',
      date1904: true,
    };
    worksheet.getCell(`N${39 + len}`).value = {
      formula: `H${39 + len}-I${39 + len}`,
      date1904: true,
    };
    worksheet.getCell(`O${39 + len}`).value = {
      formula: `SUM(O39:O${39 + len - 1})`,
      date1904: true,
    };
    worksheet.getCell(`P${39 + len}`).value = {
      formula: `ABS(M${39 + len})-ABS(O${39 + len})`,
      date1904: true,
    };
    worksheet.getCell(`G${47 - (5 - len)}`).value = {
      formula: `H${39 + len}`,
      date1904: true,
    };
    worksheet.getCell(`G${48 - (5 - len)}`).value = {
      formula: `I${39 + len}`,
      date1904: true,
    };
    worksheet.getCell(`G${49 - (5 - len)}`).value = {
      formula: `O${39 + len}`,
      date1904: true,
    };
    worksheet.getCell(`G${50 - (5 - len)}`).value = {
      formula: `J${39 + len}`,
      date1904: true,
    };
    worksheet.getCell(`G${51 - (5 - len)}`).value = {
      formula: `IF(B34+O${39 + len}>B34,B34,B34+O${39 + len})`,
      date1904: true,
    };
    worksheet.getCell(`Q${39 + len}`).value = {
      formula: `IF(AND(O${39 + len}<0,P${
        39 + len
      }<0),"ТРЕБУЕТСЯ АКТ НЕДОСТАЧИ","")`,
      date1904: true,
    };

    // ФИО оператора и водителя
    worksheet.getCell(`H${56 - (5 - len)}`).value = user?.login ?? '';
    worksheet.getCell(`H${58 - (5 - len)}`).value =
      `${operation.driver?.lastName} ${operation.driver?.firstName?.slice(
        0,
        1,
      )} ${operation.driver?.middleName?.slice(0, 1)}` ?? '';

    return workbook;
  }
}
