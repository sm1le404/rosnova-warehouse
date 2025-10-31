import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CompressionTypes, ProducerRecord } from 'kafkajs';
import { HubTopics, OperationDataDto } from 'rs-dto';
import { VehicleState } from 'rs-dto/lib/warehouse/dto/operation.data.dto';
import { KafkaService } from '../services';
import { ConfigService } from '@nestjs/config';
import { Operation } from '../../operations/entities/operation.entity';
import { OperationStatus } from '../../operations/enums';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';

@Injectable()
export class KafkaOperationSubscriber
  implements EntitySubscriberInterface<Operation>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Operation;
  }

  async afterInsert(event: InsertEvent<Operation>) {
    await this.afterInsertUpd(event);
  }

  async afterUpdate(event: UpdateEvent<Operation>) {
    await this.afterInsertUpd(event);
  }

  async afterInsertUpd({
    entity,
    manager,
  }: UpdateEvent<Operation> | InsertEvent<Operation>) {
    try {
      if (
        entity?.id &&
        !!entity?.status &&
        entity.status !== OperationStatus.PROGRESS
      ) {
        const data: Operation = await manager.findOne(Operation, {
          where: {
            id: entity.id,
          },
        });

        let kafkaPayload: ProducerRecord = {
          compression: CompressionTypes.GZIP,
          messages: [],
          topic: HubTopics.OPERATION_INSERT,
        };
        const operationDataDto: OperationDataDto = {
          ...data,
          whExternalCode: this.configService.get('SHOP_KEY'),
          fuelExtId: data?.fuel?.name,
          fuelHolderExtId: data?.fuelHolder?.inn,
          refineryExtId: data?.refinery?.shortName,
          vehicleExtId: data?.vehicle?.regNumber,
          trailerExtId: data?.trailer?.regNumber,
          tankExtId: data?.tank?.id.toString(),
          dockExtId: data?.dock?.shortName,
          driverExtId: data?.driver?.fullName,
          carrierExtId: data?.carrier?.shortName,
          type: data?.type,
          status: data?.status,
          vehicleState: JSON.parse(
            JSON.stringify(data?.vehicleState),
          ) as VehicleState[],
        };
        kafkaPayload.messages.push({
          value: JSON.stringify(operationDataDto),
        });
        await this.kafkaService.addMessage(kafkaPayload);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  async afterSoftRemove(event: SoftRemoveEvent<Operation>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.OPERATION_DELETE,
      };

      const operationDataDto: Partial<OperationDataDto> = {
        id: event.entity.id,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(operationDataDto),
      });

      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
