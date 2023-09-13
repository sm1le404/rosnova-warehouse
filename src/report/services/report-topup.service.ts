import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import path from 'path';
import { IVehicleTank } from '../../vehicle/types';

@Injectable()
export class ReportTopUpService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  async generate(operationId: number): Promise<ExcelJS.Workbook> {
    const operation = await this.operationRepository.findOne({
      where: { id: operationId },
    });

    const vehicleState = operation.vehicle
      ?.sectionVolumes as unknown as IVehicleTank[];

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(__dirname, '..', '..', 'assets', 'topup-template.xlsx'),
    );

    const worksheet = workbook.getWorksheet('calc');
    const printSheet = workbook.getWorksheet('print');

    // Назначение
    worksheet.getCell('B3').value = operation.destination ?? '';

    // Номер накладной
    worksheet.getCell('B4').value = operation.numberTTN ?? 'бн';

    // Водитель
    worksheet.getCell('B5').value =
      `${operation.driver?.lastName} ${operation.driver?.firstName?.slice(
        0,
        1,
      )} ${operation.driver?.middleName?.slice(0, 1)}` ?? '';

    // Марка автомобиля
    worksheet.getCell('B6').value = operation.vehicle?.carModel ?? '';

    // ГРЗ
    worksheet.getCell('B7').value = operation.vehicle?.regNumber ?? '';

    // Данные по отсекам
    vehicleState?.map((state, index) => {
      worksheet.getCell(`E${3 + index}`).value = operation.fuel?.fullName ?? '';
      worksheet.getCell(`F${3 + index}`).value = state?.volume ?? '';
      worksheet.getCell(`G${3 + index}`).value = state?.temperature ?? '';
      worksheet.getCell(`H${3 + index}`).value = state?.density ?? '';
    });

    const len = vehicleState?.length ?? 0;

    // Очистка формы
    printSheet.spliceRows(12 + len, 5 - len);

    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 10000,
        height: 20000,
        firstSheet: 0,
        activeTab: 0,
        visibility: 'visible',
      },
    ];

    return workbook;
  }
}
