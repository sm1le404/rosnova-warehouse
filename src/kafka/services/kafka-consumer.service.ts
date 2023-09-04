import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Consumer, ConsumerSubscribeTopics, ConsumerRunConfig } from 'kafkajs';
import { KafkaExt } from '../classes/kafka.ext';
import * as flatbuffers from 'flatbuffers';
import { Weapon } from '../fbs/my-game/sample/weapon';

@Injectable()
export class KafkaConsumerService implements OnModuleDestroy {
  private kafka: KafkaExt;

  private consumers: Consumer[] = [];

  async onModuleInit() {
    this.kafka = KafkaExt.getInstance();
    await this.consume(
      { topics: ['test.topic'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log(topic);
          console.log(partition);
          console.log(message);

          let buf = new flatbuffers.ByteBuffer(message.value);
          let weapon = Weapon.getRootAsWeapon(buf);
          console.log(weapon);
          console.log(weapon.damage());
          console.log(weapon.name());
        },
      },
    );
  }

  async onModuleDestroy() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({
      groupId: 'rs-wh',
      allowAutoTopicCreation: true,
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
}
