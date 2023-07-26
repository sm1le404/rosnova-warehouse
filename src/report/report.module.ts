import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from '../operations/entities/operation.entity';
import { ReportService } from './services/report.service';
import { ReportController } from './controllers/report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Operation])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
