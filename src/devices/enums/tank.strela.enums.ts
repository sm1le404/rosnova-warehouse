export enum TankStrelaHelperParams {
  FULL_REGISTERS = 0x2a,
  COMMAND_READ = 0x04,
  COMMAND_SET_ADDRESS = 0x06,
  DATA = 0x00,
  DATA_ADDR = 0x03,
}

export enum TankStrelaDeviceParams {
  LAYER_FLOAT = 0,
  WEIGHT = 1,
  VOLUME = 2,
  DENSITY = 3,
  TEMP = 4,
  TOTAL_VOLUME = 13,
}

export const STRELA_FIRST_BYTE = 0x50;
