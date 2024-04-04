import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispenser } from './entities/dispenser.entity';
import { DispenserController } from './controllers/dispenser.controller';
import { DispenserService } from './services/dispenser.service';
import { DispenserSubscriber } from './subscribers/dispenser.subscriber';
import { WsModule } from '../ws/ws.module';
import { DispenserQueue } from './entities/dispenser.queue.entity';
import { DispenserQueueController } from './controllers/dispenser.queue.controller';
import { DispenserQueueService } from './services/dispenser.queue.service';
import { Operation } from '../operations/entities/operation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dispenser, DispenserQueue, Operation]),
    WsModule,
  ],
  controllers: [DispenserController, DispenserQueueController],
  providers: [DispenserService, DispenserSubscriber, DispenserQueueService],
  exports: [DispenserService],
})
export class DispenserModule {}
