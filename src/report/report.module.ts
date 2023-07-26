import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from '../operations/entities/operation.entity';
import { ReportService } from './services/report.service';
import { ReportController } from './controllers/report.controller';
import { TankHistory } from '../tank/entities/tank-history.entity';
import { ReportMx2Service } from './services/report.mx2.service';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, TankHistory])],
  controllers: [ReportController],
  providers: [ReportService, ReportMx2Service],
})
export class ReportModule {}
