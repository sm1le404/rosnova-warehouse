import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class CommonSubscriber implements EntitySubscriberInterface {
  /**
   * Called after entity is loaded.
   */
  afterLoad(entity: any) {
    if (entity?.createdAt) {
      entity.createdAtIso = new Date(entity.createdAt * 1000).toISOString();
    }

    if (entity?.updatedAt) {
      entity.updatedAtIso = new Date(entity.updatedAt * 1000).toISOString();
    }

    if (entity?.deletedAt) {
      entity.deletedAtIso = new Date(entity.deletedAt * 1000).toISOString();
    }

    if (entity?.startedAt) {
      entity.startedAtIso = new Date(entity.startedAt * 1000).toISOString();
    }

    if (entity?.finishedAt) {
      entity.finishedAtIso = new Date(entity.finishedAt * 1000).toISOString();
    }

    if (entity?.dateTTN) {
      entity.dateTTNAtIso = new Date(entity.dateTTN * 1000).toISOString();
    }
  }

  /**
   * Called after entity insertion.
   */
  afterInsert(event: InsertEvent<any>) {
    if (event?.entity?.createdAt) {
      event.entity.createdAtIso = new Date(
        event.entity.createdAt * 1000,
      ).toISOString();
    }

    if (event?.entity?.updatedAt) {
      event.entity.updatedAtIso = new Date(
        event.entity.updatedAt * 1000,
      ).toISOString();
    }

    if (event?.entity?.startedAt) {
      event.entity.startedAtIso = new Date(
        event.entity.startedAt * 1000,
      ).toISOString();
    }

    if (event?.entity?.finishedAt) {
      event.entity.finishedAtIso = new Date(
        event.entity.finishedAt * 1000,
      ).toISOString();
    }

    if (event?.entity?.dateTTN) {
      event.entity.dateTTNAtIso = new Date(
        event.entity.dateTTN * 1000,
      ).toISOString();
    }
  }

  /**
   * Called before entity update.
   */
  beforeUpdate(event: UpdateEvent<any>) {
    if (event?.metadata?.propertiesMap?.updatedAt) {
      event.entity.updatedAt = Math.floor(Date.now() / 1000);
    }
  }
}
