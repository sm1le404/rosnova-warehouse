import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './entities/operation.entity';
import { OperationController } from './controllers/operation.controller';
import { OperationService } from './services/operation.service';
import { Event } from '../event/entities/event.entity';
import { EventService } from '../event/services/event.service';
import { TankModule } from '../tank/tank.module';
import { OperationListener } from './listeners/operation.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, Event]), TankModule],
  controllers: [OperationController],
  providers: [OperationService, OperationListener, EventService],
})
export class OperationModule {}
