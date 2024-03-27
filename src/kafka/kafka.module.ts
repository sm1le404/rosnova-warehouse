import { Global, Module } from '@nestjs/common';
import { KafkaService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaMessage } from './entities/kafka.message.entity';
import { KafkaOperationSubscriber } from './subscribers/kafka.operation.subscriber';
import { KafkaTankSubscriber } from './subscribers/kafka.tank.subscriber';
import { KafkaVehicleSubscriber } from './subscribers/kafka.vehicle.subscriber';
import { KafkaTrailerSubscriber } from './subscribers/kafka.trailer.subscriber';
import { KafkaDriverSubscriber } from './subscribers/kafka.driver.subscriber';
import { KafkaFuelSubscriber } from './subscribers/kafka.fuel.subscriber';
import { KafkaFuelHolderSubscriber } from './subscribers/kafka.fuel.holder.subscriber';
import { KafkaRefinerySubscriber } from './subscribers/kafka.refinery.subscriber';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([KafkaMessage])],
  providers: [
    KafkaService,
    KafkaOperationSubscriber,
    KafkaTankSubscriber,
    KafkaVehicleSubscriber,
    KafkaTrailerSubscriber,
    KafkaDriverSubscriber,
    KafkaFuelSubscriber,
    KafkaFuelHolderSubscriber,
    KafkaRefinerySubscriber,
  ],
  exports: [KafkaService],
})
export class KafkaModule {}
