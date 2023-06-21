import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refinery } from './entities/refinery.entity';
import { RefineryController } from './controllers/refinery.controller';
import { RefineryService } from './services/refinery.service';

@Module({
  imports: [TypeOrmModule.forFeature([Refinery])],
  controllers: [RefineryController],
  providers: [RefineryService],
})
export class RefineryModule {}
