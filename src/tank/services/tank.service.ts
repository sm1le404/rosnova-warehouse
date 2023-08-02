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
    console.log('update state call', payload, tank);
    if (Math.abs(tank.totalVolume - payload.TOTAL_VOLUME) >= MIN_DIFF_VOLUME) {
      const tankData: UpdateTankDto = {
        totalVolume: Number(payload.TOTAL_VOLUME.toFixed(4)),
        volume: Number(payload.VOLUME.toFixed(4)),
        temperature: Number(payload.TEMP.toFixed(4)),
        density: Number(payload.DENSITY.toFixed(4)),
        weight: Number(payload.WEIGHT.toFixed(4)),
        level: Number(payload.LAYER_LIQUID.toFixed(4)),
      };

      await this.update(
        { where: { id: tank.id } },
        { ...tankData, isBlocked: true },
      );
      await this.tankHistoryService.create({
        ...tankData,
        fuel: tank.fuel,
        fuelHolder: tank.fuelHolder,
        refinery: tank.refinery,
        tank: { id: tank.id },
      });
    } else {
      await this.update({ where: { id: tank.id } }, { isBlocked: false });
    }
  }
}
