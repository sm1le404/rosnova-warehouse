import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import path from 'path';

@Injectable()
export class ReportDrawbackService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  async generate(payload: any): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(__dirname, '..', '..', 'assets', 'drawback-template.xlsx'),
    );

    return workbook;
  }
}
