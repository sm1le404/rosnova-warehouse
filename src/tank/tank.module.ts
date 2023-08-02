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
import { TankHistoryController } from './controllers/tank-history.controller';
import { TankListener } from './listeners/tank.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Tank, Calibration, TankHistory])],
  controllers: [TankController, CalibrationController, TankHistoryController],
  providers: [
    TankService,
    CalibrationService,
    TankHistoryService,
    TankListener,
  ],
})
export class TankModule {}
