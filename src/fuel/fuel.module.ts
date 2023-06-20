import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fuel } from './entities/fuel.entity';
import { FuelController } from './controllers/fuel.controller';
import { FuelService } from './services/fuel.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fuel])],
  controllers: [FuelController],
  providers: [FuelService],
})
export class FuelModule {}
