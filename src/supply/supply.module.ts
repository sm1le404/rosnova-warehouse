import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supply } from './entities/supply.entity';
import { SupplyController } from './controllers/supply.controller';
import { SupplyService } from './services/supply.service';

@Module({
  imports: [TypeOrmModule.forFeature([Supply])],
  controllers: [SupplyController],
  providers: [SupplyService],
})
export class SupplyModule {}
