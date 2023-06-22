import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tank } from './entities/tank.entity';
import { TankController } from './controllers/tank.controller';
import { TankService } from './services/tank.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tank])],
  controllers: [TankController],
  providers: [TankService],
})
export class TankModule {}
