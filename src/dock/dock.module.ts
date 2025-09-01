import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DockService } from './services/dock.service';
import { DockController } from './controllers/dock.controller';
import { Dock } from './entities/dock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dock])],
  controllers: [DockController],
  providers: [DockService],
})
export class DockModule {}
