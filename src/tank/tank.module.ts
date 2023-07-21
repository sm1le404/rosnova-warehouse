import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tank } from './entities/tank.entity';
import { TankController } from './controllers/tank.controller';
import { TankService } from './services/tank.service';
import { Calibration } from './entities/calibration.entity';
import { CalibrationController } from './controllers/calibration.controller';
import { CalibrationService } from './services/calibration.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tank, Calibration])],
  controllers: [TankController, CalibrationController],
  providers: [TankService, CalibrationService],
})
export class TankModule {}
