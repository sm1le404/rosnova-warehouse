import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  Consumer,
  Kafka,
  KafkaConfig,
  logLevel,
  Producer,
  ProducerRecord,
} from 'kafkajs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { WarehouseTopicEvent, WarehouseTopics } from 'rs-dto';
import { Repository } from 'typeorm';
import { KafkaMessage } from '../entities/kafka.message.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  producerConnected?: boolean = false;

  consumerConnected?: boolean = false;

  private readonly kafka: Kafka;

  private producer: Producer;

  private consumer: Consumer;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    @InjectRepository(KafkaMessage)
    private readonly kafkaMessageRepository: Repository<KafkaMessage>,
  ) {
    const brokersList = this.configService.get('KAFKA_BROKERS_LIST')
      ? this.configService.get('KAFKA_BROKERS_LIST').split(',')
      : [];

    if (brokersList.length > 0) {
      const config: KafkaConfig = {
        clientId: 'rs-wh-client',
        brokers: brokersList,
        retry: {
          initialRetryTime: 5000,
          retries: 1,
          multiplier: 1,
          maxRetryTime: 5000,
        },
        logLevel: logLevel.ERROR,
      };
      if (process?.env?.KAFKA_PLAIN_LOGIN && process?.env?.KAFKA_PLAIN_PWD) {
        config.sasl = {
          mechanism: 'plain',
          username: process.env.KAFKA_PLAIN_LOGIN,
          password: process.env.KAFKA_PLAIN_PWD,
        };
      }

      this.kafka = new Kafka(config);

      this.producer = this.kafka.producer();

      this.producer.on(`producer.connect`, () => {
        this.producerConnected = true;
      });

      this.producer.on(`producer.disconnect`, () => {
        this.producerConnected = false;
      });
    }
  }

  async initConsumer() {
    const topicList = Object.values(WarehouseTopics as object);
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
          new WarehouseTopicEvent(
            topic as WarehouseTopics,
            message.value,
            message.value.toString(),
          ),
        );
      },
    });
  }

  async initService() {
    if (!this.kafka) {
      return;
    }
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
    if (!this.kafka) {
      return;
    }
    try {
      await this.consumer.disconnect();
      await this.producer.disconnect();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async sendMessage(payload: ProducerRecord) {
    if (this.kafka) {
      await this.producer.send(payload);
    }
  }

  async addMessage(payload: ProducerRecord) {
    const message = await this.kafkaMessageRepository.create({
      data: JSON.stringify(payload),
    });
    await this.kafkaMessageRepository.save(message);
  }

  async deleteMessage(id: number) {
    await this.kafkaMessageRepository.delete({ id });
  }

  async executeSender() {
    // if (!this.producerConnected) {
    //   return;
    // }
    const messagesList = await this.kafkaMessageRepository.find({
      take: 100,
      order: { id: 'asc' },
    });
    for (const message of messagesList) {
      // let data: ProducerRecord;
      // try {
      //   data = JSON.parse(message.data);
      // } catch (e) {}
      //
      // if (!!data) {
      //   await this.sendMessage(data);
      // }

      await this.deleteMessage(message.id);
    }
    await this.kafkaMessageRepository.query(`VACUUM;`);
  }
}
