import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DeviceEvents } from '../../devices/enums/device-events.enum';
import { TankService } from '../services/tank.service';
import { TankUpdateStateEvent } from '../events/tank-update-state.event';

@Injectable()
export class DispenserListener {
  constructor(private readonly tankService: TankService) {}

  @OnEvent(DeviceEvents.UPDATE_TANK_STATE)
  handleDispenserStartedEvent(event: TankUpdateStateEvent) {
    this.tankService.updateState(event.addressId, event.payload);
  }
}
