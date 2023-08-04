import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import path from 'path';
import { dateFormatter, timeFormatter } from '../utils';
import { IVehicleTank } from '../../vehicle/types';

@Injectable()
export class ReportDrawbackService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  async generate(operationId: number): Promise<ExcelJS.Workbook> {
    const operation = await this.operationRepository.findOne({
      where: { id: operationId },
    });
    const docDate = dateFormatter(Math.floor(Date.now() / 1000));
    const dateStart = dateFormatter(operation.startedAt);
    const timeStart = timeFormatter(new Date(operation.startedAt));
    const dateEnd = dateFormatter(operation.finishedAt);
    const timeEnd = timeFormatter(new Date(operation.finishedAt));
    const vehicleState = operation.vehicleState as unknown as IVehicleTank[];

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(__dirname, '..', '..', 'assets', 'drawback-template.xlsx'),
    );

    const worksheet = workbook.getWorksheet('page');
    // Номер накладной
    worksheet.getCell('D1').value = operation.numberTTN ?? 'бн';
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

    // Даты начала и конца приемки
    worksheet.getCell('D28:E28').value = dateStart;
    worksheet.getCell('F28').value = timeStart;
    worksheet.getCell('D29:E29').value = dateEnd;
    worksheet.getCell('F29').value = timeEnd;

    // Автомобиль и прицеп
    worksheet.getCell('B30:C30').value = operation.vehicle?.regNumber ?? '';
    worksheet.getCell('B31:C31').value = operation.trailer?.regNumber ?? '';

    // Сведения о грузе
    worksheet.getCell('B34').value = operation.docWeight ?? '';
    worksheet.getCell('B35').value = operation.docDensity ?? '';

    // Данные по отсекам
    vehicleState?.map((state, index) => {
      worksheet.getCell(`B${39 + index}`).value = state?.volume ?? '';
      worksheet.getCell(`C${39 + index}`).value = state?.density ?? '';
      worksheet.getCell(`D${39 + index}`).value = state?.temperature ?? '';
    });

    // ФИО оператора и водителя
    worksheet.getCell('H58').value = operation.shift?.user?.login ?? '';
    worksheet.getCell('H60').value =
      `${operation.driver?.lastName} ${operation.driver?.firstName?.slice(
        0,
        1,
      )} ${operation.driver?.middleName?.slice(0, 1)}` ?? '';

    return workbook;
  }
}
