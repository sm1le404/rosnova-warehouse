import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tank } from '../entities/tank.entity';
import { DeviceInfoType } from '../../devices/types/device.info.type';
import { UpdateTankDto } from '../dto';
import { MIN_DIFF_VOLUME } from '../constants';
import { TankHistoryService } from './tank-history.service';

@Injectable()
export class TankService extends CommonService<Tank> {
  constructor(
    @InjectRepository(Tank)
    private tankRepository: Repository<Tank>,
    private readonly tankHistoryService: TankHistoryService,
  ) {
    super();
  }

  getRepository(): Repository<Tank> {
    return this.tankRepository;
  }

  async updateState(addressId: number, payload: DeviceInfoType): Promise<void> {
    const tank = await this.tankRepository.findOne({ where: { addressId } });
    if (!tank) {
      return;
    }

    if (Math.abs(tank.totalVolume - payload.TOTAL_VOLUME) >= MIN_DIFF_VOLUME) {
      const tankData: UpdateTankDto = {
        totalVolume: Number(payload.TOTAL_VOLUME.toFixed(2)),
        volume: Number(payload.VOLUME.toFixed(2)),
        temperature: Number(payload.TEMP.toFixed(2)),
        density: Number(payload.DENSITY.toFixed(2)),
        weight: Number(payload.WEIGHT.toFixed(2)),
      };

      await this.update({ where: { id: tank.id } }, tankData);
      await this.tankHistoryService.create({
        ...tankData,
        fuel: tank.fuel,
        fuelHolder: tank.fuelHolder,
        refinery: tank.refinery,
        tank: { id: tank.id },
      });
    }
  }
}
