import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportMx2Service } from '../services/report.mx2.service';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Response } from 'express';
import { GetMx2Dto } from '../dto/get-mx2.dto';
import { ReportOutcomeService } from '../services/report-outcome.service';
import { JwtAuthGuard } from '../../auth/guard';
import { HasRole } from '../../auth/guard/has-role.guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../../user/enums';
import { GetOutcomeReportDto } from '../dto/get-outcome-report.dto';
import { ReportFilteredService } from '../services/report-filtered.service';
import { GetMonthReportDto } from '../dto/get-month-report.dto';
import { ReportDrawbackService } from '../services/report-drawback.service';

@ApiTags('Report')
@Controller('report')
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
export class ReportController {
  constructor(
    private readonly reportMx2Service: ReportMx2Service,
    private readonly reportOutcomeService: ReportOutcomeService,
    private readonly reportMonthService: ReportFilteredService,
    private readonly reportDrawbackService: ReportDrawbackService,
  ) {}

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

  @Get('outcome')
  async outcomeReport(
    @Res() res: Response,
    @Query() payload: GetOutcomeReportDto,
  ) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-disposition',
      `attachment;filename=outcome-report-${Date.now()}.xlsx`,
    );
    const workbook = await this.reportOutcomeService.generate(payload);
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }

  @Get('month')
  async monthReport(@Res() res: Response, @Query() payload: GetMonthReportDto) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-disposition',
      `attachment;filename=month-report-${Date.now()}.xlsx`,
    );
    const workbook = await this.reportMonthService.generate(payload);
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }

  @Get('drawback')
  async drawbackReport(
    @Res() res: Response,
    @Query('operationId') operationId: number,
  ) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-disposition',
      `attachment;filename=drawback-report-${Date.now()}.xlsx`,
    );
    const workbook = await this.reportDrawbackService.generate(operationId);
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }
}
