import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrierService } from './services/carrier.service';
import { Carrier } from './entities/carrier.entity';
import { CarrierController } from './controllers/carrier.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Carrier])],
  controllers: [CarrierController],
  providers: [CarrierService],
})
export class CarrierModule {}
