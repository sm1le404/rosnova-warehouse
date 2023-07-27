import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportMx2Service } from '../services/report.mx2.service';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Response } from 'express';
import { GetMx2Dto } from '../dto/get-mx2.dto';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportMx2Service: ReportMx2Service) {}

  @Get('mx2')
  async getMx2(@Res() res: Response, @Query() payload: GetMx2Dto) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-disposition', `attachment;filename=mx2report.xlsx`);
    const workbook = await this.reportMx2Service.generate(payload);
    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  }
}
