import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from '../operations/entities/operation.entity';
import { ReportOutcomeService } from './services/report-outcome.service';
import { ReportController } from './controllers/report.controller';
import { TankHistory } from '../tank/entities/tank-history.entity';
import { ReportMx2Service } from './services/report.mx2.service';
import { ReportFilteredService } from './services/report-filtered.service';
import { ReportDrawbackService } from './services/report-drawback.service';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, TankHistory])],
  controllers: [ReportController],
  providers: [
    ReportOutcomeService,
    ReportMx2Service,
    ReportFilteredService,
    ReportDrawbackService,
  ],
})
export class ReportModule {}
