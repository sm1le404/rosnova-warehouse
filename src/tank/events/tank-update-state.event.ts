import { DeviceInfoType } from '../../devices/types/device.info.type';

export class TankUpdateStateEvent {
  addressId: number;

  payload: DeviceInfoType;

  constructor(addressId: number, payload: DeviceInfoType) {
    this.addressId = addressId;
    this.payload = payload;
  }
}
