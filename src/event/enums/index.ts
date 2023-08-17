export enum EventType {
  DEFAULT = 'default',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum EventCollectionType {
  DEFAULT = 'default',
  OPERATION = 'operation',
  FUEL = 'fuel',
  SHIFT = 'shift',
  SETTINGS = 'settings',
  DRAIN_FUEL = 'drain_fuel',
  DRAIN_FUEL_DONE = 'drain_fuel_done',
  CALL_DISPENSER_COMMAND = 'dispenser_command',
}
