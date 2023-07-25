import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tank } from './entities/tank.entity';
import { TankController } from './controllers/tank.controller';
import { TankService } from './services/tank.service';
import { Calibration } from './entities/calibration.entity';
import { CalibrationController } from './controllers/calibration.controller';
import { CalibrationService } from './services/calibration.service';
import { TankHistoryService } from './services/tank-history.service';
import { TankHistory } from './entities/tank-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tank, Calibration, TankHistory])],
  controllers: [TankController, CalibrationController],
  providers: [TankService, CalibrationService, TankHistoryService],
})
export class TankModule {}
