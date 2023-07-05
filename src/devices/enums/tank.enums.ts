export enum TankDeviceParams {
  LAYER_FLOAT = 0x01,
  TEMP = 0x02,
  VOLUME_PERCENT = 0x03,
  TOTAL_VOLUME = 0x04,
  WEIGHT = 0x05,
  DENSITY = 0x06,
  VOLUME = 0x07,
  LAYER_LIQUID = 0x08,
}

export const TANK_FIRST_BYTE = 0xb5;

export enum TankHelperParams {
  ADDRESS_LINE = 0x0a,
  DATA_LENGTH = 0x01,
  COMMAND = 0x01,
  DATA = 0x00,
}
