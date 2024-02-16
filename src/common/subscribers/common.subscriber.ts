import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class CommonSubscriber implements EntitySubscriberInterface {
  private static prepareTzTime(time: number): number {
    const date = new Date(time * 1000);
    if (-date.getTimezoneOffset() > 0) {
      date.setHours(date.getHours() + -date.getTimezoneOffset() / 60);
    }
    return Math.floor(date.getTime() / 1000);
  }

  /**
   * Called after entity is loaded.
   */
  afterLoad(entity: any) {
    if (entity?.createdAt) {
      entity.createdAtIso = new Date(entity.createdAt * 1000).toISOString();
      entity.createdTzTime = CommonSubscriber.prepareTzTime(entity.createdAt);
    }

    if (entity?.updatedAt) {
      entity.updatedAtIso = new Date(entity.updatedAt * 1000).toISOString();
      entity.updatedAtTzTime = CommonSubscriber.prepareTzTime(entity.updatedAt);
    }

    if (entity?.deletedAt) {
      entity.deletedAtIso = new Date(entity.deletedAt * 1000).toISOString();
      entity.deletedAtTzTime = CommonSubscriber.prepareTzTime(entity.deletedAt);
    }

    if (entity?.startedAt) {
      entity.startedAtIso = new Date(entity.startedAt * 1000).toISOString();
      entity.startedAtTzTime = CommonSubscriber.prepareTzTime(entity.startedAt);
    }

    if (entity?.finishedAt) {
      entity.finishedAtIso = new Date(entity.finishedAt * 1000).toISOString();
      entity.finishedAtTzTime = CommonSubscriber.prepareTzTime(
        entity.finishedAt,
      );
    }

    if (entity?.dateTTN) {
      entity.dateTTNAtIso = new Date(entity.dateTTN * 1000).toISOString();
      entity.dateTTNAtTzTime = CommonSubscriber.prepareTzTime(entity.dateTTN);
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
