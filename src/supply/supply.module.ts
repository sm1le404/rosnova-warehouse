import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supply } from './entities/supply.entity';
import { SupplyController } from './controllers/supply.controller';
import { SupplyService } from './services/supply.service';
import { EventService } from '../event/services/event.service';
import { Event } from '../event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supply, Event])],
  controllers: [SupplyController],
  providers: [SupplyService, EventService],
})
export class SupplyModule {}
