import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from '../operations/entities/operation.entity';
import { ReportOutcomeService } from './services/report-outcome.service';
import { ReportController } from './controllers/report.controller';
import { TankHistory } from '../tank/entities/tank-history.entity';
import { ReportMx2Service } from './services/report.mx2.service';
import { ReportFilteredService } from './services/report-filtered.service';
import { ReportDrawbackService } from './services/report-drawback.service';
import { ReportTopUpService } from './services/report-topup.service';
import { ReportTtnService } from './services/report-ttn.service';
import { ReportMx1Service } from './services/report.mx1.service';
import { ReportDiffDetectionService } from './services/report-diff-detection.service';
import { Fuel } from '../fuel/entities/fuel.entity';
import { FuelHolder } from '../fuel-holder/entities/fuel-holder.entity';
import { ReportCloseShiftService } from './services/report-close-shift.service';
import { ReportSummaryDrawbackService } from './services/report-summary-drawback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operation, TankHistory, Fuel, FuelHolder]),
  ],
  controllers: [ReportController],
  providers: [
    ReportCloseShiftService,
    ReportOutcomeService,
    ReportMx2Service,
    ReportFilteredService,
    ReportDrawbackService,
    ReportTopUpService,
    ReportTtnService,
    ReportMx1Service,
    ReportDiffDetectionService,
    ReportSummaryDrawbackService,
  ],
})
export class ReportModule {}
