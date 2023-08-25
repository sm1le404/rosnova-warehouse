import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { ShiftController } from './controllers/shift.controller';
import { ShiftService } from './services/shift.service';
import { Event } from '../event/entities/event.entity';
import { EventService } from '../event/services/event.service';
import { DevicesModule } from '../devices/devices.module';
import { DispenserModule } from '../dispenser/dispenser.module';
import { TankModule } from '../tank/tank.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift, Event]),
    DevicesModule,
    DispenserModule,
    TankModule,
  ],
  controllers: [ShiftController],
  providers: [ShiftService, EventService],
})
export class ShiftModule {}
