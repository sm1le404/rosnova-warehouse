import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Consumer, Kafka, logLevel, Producer, ProducerRecord } from 'kafkajs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { Warehouse } from 'rs-dto/lib/warehouse/kafka/topics';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  producerConnected?: boolean = false;

  consumerConnected?: boolean = false;

  private kafka: Kafka;

  private producer: Producer;

  private consumer: Consumer;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {
    this.kafka = new Kafka({
      clientId: 'rs-wh-client',
      brokers: process?.env?.KAFKA_BROKERS_LIST
        ? process.env.KAFKA_BROKERS_LIST.split(',')
        : [],
      retry: {
        initialRetryTime: 5000,
        retries: 1,
        multiplier: 1,
        maxRetryTime: 5000,
      },
      logLevel: logLevel.ERROR,
    });

    this.producer = this.kafka.producer();

    this.producer.on(`producer.connect`, () => {
      this.producerConnected = true;
    });

    this.producer.on(`producer.disconnect`, () => {
      this.producerConnected = false;
    });
  }

  async initConsumer() {
    const topicList = Object.values(Warehouse.Topics as object);
    this.consumer = this.kafka.consumer({
      groupId: 'rs-wh',
      allowAutoTopicCreation: true,
    });
    this.consumer.on(`consumer.connect`, () => {
      this.consumerConnected = true;
    });
    this.consumer.on(`consumer.disconnect`, () => {
      this.consumerConnected = false;
    });
    this.consumer.on(`consumer.crash`, () => {
      this.consumerConnected = false;
    });
    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: Array.isArray(topicList) ? topicList : [],
    });
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (
          !!message?.headers?.TO &&
          message.headers.TO.toString() !==
            this.configService.get('KAFKA_CONSUMER_NAME')
        ) {
          return;
        }
        this.eventEmitter.emit(
          topic,
          new Warehouse.TopicEvent(
            topic as Warehouse.Topics,
            message.value,
            message.value.toString(),
          ),
        );
      },
    });
  }

  async initService() {
    try {
      if (!this.producerConnected) {
        await this.producer.connect();
      }
      if (!this.consumerConnected) {
        await this.initConsumer();
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  async onModuleInit() {
    await this.initService();
  }

  async onModuleDestroy() {
    try {
      await this.consumer.disconnect();
      await this.producer.disconnect();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async sendMessage(payload: ProducerRecord) {
    await this.producer.send(payload);
  }
}
