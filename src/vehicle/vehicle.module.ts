import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleController } from './controllers/vehicle.controller';
import { VehicleService } from './services/vehicle.service';
import { Trailer } from './entities/trailer.entity';
import { TrailerService } from './services/trailer.service';
import { TrailerController } from './controllers/trailer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Trailer])],
  controllers: [VehicleController, TrailerController],
  providers: [VehicleService, TrailerService],
})
export class VehicleModule {}
