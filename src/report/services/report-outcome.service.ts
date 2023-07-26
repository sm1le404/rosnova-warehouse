import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { Operation } from '../../operations/entities/operation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportOutcomeService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  async generate(shiftId: number): Promise<ExcelJS.Workbook> {
    const operations = await this.operationRepository.find();

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet('стр1', {
      properties: { tabColor: { argb: 'FFC0000' } },
    });
    worksheet.addRow(['test', 'test']);
    return workbook;
  }
}
