import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measurement } from './entities/measurement.entity';
import { MeasurementController } from './controllers/measurement.controller';
import { MeasurementService } from './services/measurement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Measurement])],
  controllers: [MeasurementController],
  providers: [MeasurementService],
})
export class MeasurementModule {}
