import { DeviceInfoType } from '../../devices/types/device.info.type';

export class TankUpdateStateEvent {
  addressId: number;

  comId: number;

  payload: DeviceInfoType;

  constructor(addressId: number, comId: number, payload: DeviceInfoType) {
    this.addressId = addressId;
    this.comId = comId;
    this.payload = payload;
  }
}
