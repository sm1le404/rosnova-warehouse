import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outcome } from './entities/outcome.entity';
import { OutcomeController } from './controllers/outcome.controller';
import { OutcomeService } from './services/outcome.service';
import { Event } from '../event/entities/event.entity';
import { EventService } from '../event/services/event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Outcome, Event])],
  controllers: [OutcomeController],
  providers: [OutcomeService, EventService],
})
export class OutcomeModule {}
