import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DeviceEvents } from '../../devices/enums/device-events.enum';
import { TankService } from '../services/tank.service';
import { TankUpdateStateEvent } from '../events';
import { TankClearDocStateEvent, TankEventEnum } from '../events';
@Injectable()
export class TankListener {
  constructor(private readonly tankService: TankService) {}

  @OnEvent(DeviceEvents.UPDATE_TANK_STATE)
  async handleDispenserStartedEvent(event: TankUpdateStateEvent) {
    await this.tankService.updateState(event.addressId, event.payload);
  }

  @OnEvent(TankEventEnum.CLEAR_DOCS)
  async handleClearDocsEvent(event: TankClearDocStateEvent) {
    await this.tankService.clearDocs(event);
  }
}
