import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outcome } from './entities/outcome.entity';
import { OutcomeController } from './controllers/outcome.controller';
import { OutcomeService } from './services/outcome.service';

@Module({
  imports: [TypeOrmModule.forFeature([Outcome])],
  controllers: [OutcomeController],
  providers: [OutcomeService],
})
export class OutcomeModule {}
