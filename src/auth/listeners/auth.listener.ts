import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthEventsEnum } from '../enums/auth.events.enum';
import { AuthEvent } from '../events/auth.event';
import { ShiftService } from '../../shift/services/shift.service';
import { DeviceDispenserService } from '../../devices/services/device.dispenser.service';
import { DispenserService } from '../../dispenser/services/dispenser.service';

@Injectable()
export class AuthListener {
  constructor(
    protected readonly shiftService: ShiftService,
    private readonly deviceDispenserService: DeviceDispenserService,
    private readonly dispenserService: DispenserService,
  ) {}

  @OnEvent(AuthEventsEnum.LOGIN_EVENT)
  async handleLoginEvent(event: AuthEvent) {
    try {
      await this.deviceDispenserService.updateDispenserSummary();
    } catch (e) {}

    const dispensers = await this.dispenserService.find({
      select: { id: true, currentCounter: true },
    });

    await this.shiftService.update(
      {
        where: { id: event.shiftId },
      },
      {
        startDispensersState: JSON.stringify(
          dispensers.map((item) => {
            return {
              id: item.id,
              summary: item.currentCounter,
            };
          }),
        ),
      },
    );
  }
}
