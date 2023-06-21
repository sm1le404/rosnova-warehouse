import { Module } from '@nestjs/common';
import { DriverController } from './controllers/driver.controller';
import { DriverService } from './services/driver.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
