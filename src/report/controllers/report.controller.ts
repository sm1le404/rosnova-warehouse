import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { ReportTopUpService } from '../services/report-topup.service';
import { dateFormatter, translitFromRuToEn } from '../utils';
import { Operation } from '../../operations/entities/operation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ICurrentUser } from '../../auth/interface/current-user.interface';
import { ReportTtnService } from '../services/report-ttn.service';
import { GetMx1Dto } from '../dto/get-mx1.dto';
import { ReportMx1Service } from '../services/report.mx1.service';
import { ReportDiffDetectionService } from '../services/report-diff-detection.service';
import { GetDiffDetectionDto } from '../dto/get-diff-detection.dto';

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
    private readonly reportTopUpService: ReportTopUpService,
    private readonly reportTtnService: ReportTtnService,
    private readonly reportMx1Service: ReportMx1Service,
    private readonly reportDiffDetectionService: ReportDiffDetectionService,
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  @ApiOperation({
    summary: 'Mx1 report',
  })
  @Get('mx1')
  async getMx1(@Res() res: Response, @Query() payload: GetMx1Dto) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-disposition',
      `attachment;filename=mx1report-${Date.now()}.xlsx`,
    );
    const workbook = await this.reportMx1Service.generate(payload);
    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  }

  @ApiOperation({
    summary: 'Mx2 report',
  })
  @Get('mx2')
  async getMx2(@Res() res: Response, @Query() payload: GetMx2Dto) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-disposition',
      `attachment;filename=mx2report-${Date.now()}.xlsx`,
    );
    const workbook = await this.reportMx2Service.generate(payload);
    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  }

  @ApiOperation({
    summary: 'Outcome report by shift or date',
  })
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

  @ApiOperation({
    summary: 'Income report by shift or date',
  })
  @Get('month')
  async monthReport(@Res() res: Response, @Query() payload: GetMonthReportDto) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-disposition',
      `attachment;filename=${String(
        new Date(Date.now()).getMonth() + 1,
      ).padStart(2, '0')}_report.xlsx`,
    );
    const workbook = await this.reportMonthService.generate(payload);
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }

  @ApiOperation({
    summary: 'Drawback report by operation',
  })
  @Get('drawback')
  async drawbackReport(
    @Res() res: Response,
    @Query('operationId') operationId: number,
    @CurrentUser() user: ICurrentUser,
  ) {
    const date = dateFormatter(Math.floor(Date.now() / 1000));
    const op = await this.operationRepository.findOne({
      where: { id: operationId },
    });
    const name = translitFromRuToEn(
      `приход ${op?.numberTTN ?? 'empty'}-${date}`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-disposition', `attachment;filename=${name}.xlsx`);
    const workbook = await this.reportDrawbackService.generate(
      operationId,
      user,
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }

  @ApiOperation({
    summary: 'Internal displacement report by operation',
  })
  @Get('topup')
  async topUpReport(
    @Res() res: Response,
    @Query('operationId') operationId: number,
  ) {
    const date = dateFormatter(Math.floor(Date.now() / 1000));
    const op = await this.operationRepository.findOne({
      where: { id: operationId },
    });
    const name = translitFromRuToEn(
      `отпуск ${op?.numberTTN ?? 'empty'}-${date}`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-disposition', `attachment;filename=${name}.xlsx`);
    const workbook = await this.reportTopUpService.generate(operationId);
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }

  @ApiOperation({
    summary: 'TTN report by operation',
  })
  @Get('ttn')
  async ttnReport(
    @Res() res: Response,
    @Query('operationId') operationId: number,
    @CurrentUser() user: ICurrentUser,
  ) {
    const date = dateFormatter(Math.floor(Date.now() / 1000));
    const op = await this.operationRepository.findOne({
      where: { id: operationId },
    });
    const name = translitFromRuToEn(`ттн ${op?.numberTTN ?? 'empty'}-${date}`);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-disposition', `attachment;filename=${name}.xlsx`);
    const workbook = await this.reportTtnService.generate(operationId, user);
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }

  @ApiOperation({
    summary: 'Frequency of difference detection report',
  })
  @SetRoles(RoleType.ADMIN)
  @Get('diff-detection')
  async diffDetection(
    @Res() res: Response,
    @Query() payload: GetDiffDetectionDto,
  ) {
    const date = dateFormatter(Math.floor(Date.now() / 1000));
    const name = translitFromRuToEn(
      `статистический отчёт по расхождениям ${date}`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-disposition', `attachment;filename=${name}.xlsx`);
    const workbook = await this.reportDiffDetectionService.generate(payload);
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }
}
