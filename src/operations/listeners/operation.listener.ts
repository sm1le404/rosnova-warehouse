import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OperationService } from '../services/operation.service';
import { OperationEvent } from '../enums';
import { TankOperationStateEvent } from '../events/tank-operation-state.event';

@Injectable()
export class OperationListener {
  constructor(private readonly operationService: OperationService) {}

  @OnEvent(OperationEvent.FINISH)
  async handleOperationFinishEvent(event: TankOperationStateEvent) {
    await this.operationService.changeTankState(
      event.tankId,
      event.operationType,
      event.operationVolume,
      event.operationWeight,
    );
  }
}
