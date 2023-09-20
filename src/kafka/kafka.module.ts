import { Global, Module } from '@nestjs/common';
import { KafkaService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaMessage } from './entities/kafka.message.entity';
import { KafkaRefSubscriber } from './subscribers/kafka.ref.subscriber';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([KafkaMessage])],
  providers: [KafkaService, KafkaRefSubscriber],
  exports: [KafkaService, KafkaRefSubscriber],
})
export class KafkaModule {}
