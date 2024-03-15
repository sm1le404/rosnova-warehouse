import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispenser } from './entities/dispenser.entity';
import { DispenserController } from './controllers/dispenser.controller';
import { DispenserService } from './services/dispenser.service';
import { DispenserSubscriber } from './subscribers/dispenser.subscriber';
import { WsModule } from '../ws/ws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dispenser]), WsModule],
  controllers: [DispenserController],
  providers: [DispenserService, DispenserSubscriber],
  exports: [DispenserService],
})
export class DispenserModule {}
