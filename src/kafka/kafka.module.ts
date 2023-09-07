import { Global, Module } from '@nestjs/common';
import { KafkaService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaMessage } from './entities/kafka.message.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([KafkaMessage])],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
