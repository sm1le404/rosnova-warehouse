import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelHolder } from './entities/fuel-holder.entity';
import { FuelHolderController } from './controllers/fuel-holder.controller';
import { FuelHolderService } from './services/fuel-holder.service';

@Module({
  imports: [TypeOrmModule.forFeature([FuelHolder])],
  controllers: [FuelHolderController],
  providers: [FuelHolderService],
})
export class FuelHolderModule {}
