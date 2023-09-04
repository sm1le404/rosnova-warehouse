import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Producer, ProducerRecord } from 'kafkajs';
import { KafkaExt } from '../classes/kafka.ext';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  private kafka: KafkaExt;

  private producer: Producer;

  async onModuleInit() {
    this.kafka = KafkaExt.getInstance();
    this.producer = this.kafka.producer();
    try {
      await this.producer.connect();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async sendMessage(payload: ProducerRecord) {
    await this.producer.send(payload);
  }
}
