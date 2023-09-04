import { Kafka, logLevel } from 'kafkajs';
import 'dotenv/config';

export class KafkaExt extends Kafka {
  private static instance: KafkaExt;

  producerConnected?: boolean = false;

  static getInstance(): KafkaExt {
    if (!KafkaExt.instance) {
      KafkaExt.instance = new KafkaExt({
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

      KafkaExt.instance.producer().on(`producer.connect`, () => {
        KafkaExt.instance.producerConnected = true;
      });

      KafkaExt.instance.producer().on(`producer.disconnect`, () => {
        KafkaExt.instance.producerConnected = false;
      });
    }

    return KafkaExt.instance;
  }
}
