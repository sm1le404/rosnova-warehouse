import { OperationType } from '../enums';

export class TankOperationStateEvent {
  tankId: number;

  operationType: OperationType;

  operationVolume: number;

  operationWeight: number;

  constructor(
    tankId: number,
    operationType: OperationType,
    operationVolume: number,
    operationWeight: number,
  ) {
    this.tankId = tankId;
    this.operationType = operationType;
    this.operationVolume = operationVolume;
    this.operationWeight = operationWeight;
  }
}
