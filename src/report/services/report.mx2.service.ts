import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Workbook } from 'exceljs';
import path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { Repository } from 'typeorm';
import { GetMx2Dto } from '../dto/get-mx2.dto';

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
    console.log(payload);
    worksheetMain.addRow(['1', '1']);
    return workbook;
  }
}
