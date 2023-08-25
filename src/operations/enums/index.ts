export enum OperationStatus {
  CREATED = 'created',
  STARTED = 'started',
  PROGRESS = 'progress',
  INTERRUPTED = 'interrupted',
  STOPPED = 'stopped',
  FINISHED = 'finished',
}

export enum OperationType {
  OUTCOME = 'outcome',
  SUPPLY = 'supply',
  INTERNAL = 'internal',
  RETURN = 'return',
}

export enum OperationEvent {
  FINISH = 'FINISH',
}
