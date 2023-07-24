import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tank } from '../entities/tank.entity';
import { DeviceInfoType } from '../../devices/types/device.info.type';
import { CreateTankDto } from '../dto';
import { MIN_DIFF_VOLUME } from '../constants';

@Injectable()
export class TankService extends CommonService<Tank> {
  constructor(
    @InjectRepository(Tank)
    private tankRepository: Repository<Tank>, // private readonly tankHistoryService:
  ) {
    super();
  }

  getRepository(): Repository<Tank> {
    return this.tankRepository;
  }

  async updateState(addressId: number, payload: DeviceInfoType) {
    const tank = await this.tankRepository.findOne({ where: { addressId } });
    if (!tank) {
      const tankData: CreateTankDto = {
        addressId,
        sortIndex: 0,
        totalVolume: payload.TOTAL_VOLUME,
        volume: payload.VOLUME,
        temperature: payload.TEMP,
        density: payload.DENSITY,
        weight: payload.WEIGHT,
      };

      await this.create({ ...tankData, tankHistory: tankData });
    }

    if (Math.abs(tank.totalVolume - payload.TOTAL_VOLUME) >= MIN_DIFF_VOLUME) {
    }
  }
}
