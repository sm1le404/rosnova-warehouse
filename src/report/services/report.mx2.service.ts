import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Workbook } from 'exceljs';

@Injectable()
export class ReportMx2Service {
  async generate(): Promise<Workbook> {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet('стр1', {
      properties: { tabColor: { argb: 'FFC0000' } },
    });
    worksheet.addRow(['test', 'test']);
    return workbook;
  }
}
