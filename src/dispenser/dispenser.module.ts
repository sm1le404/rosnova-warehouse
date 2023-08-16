import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispenser } from './entities/dispenser.entity';
import { DispenserController } from './controllers/dispenser.controller';
import { DispenserService } from './services/dispenser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dispenser])],
  controllers: [DispenserController],
  providers: [DispenserService],
  exports: [DispenserService],
})
export class DispenserModule {}
