import { CommonService } from '../../common/services/common.service';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tank } from '../entities/tank.entity';
import { DeviceInfoType } from '../../devices/types/device.info.type';
import { MIN_DIFF_VOLUME } from '../constants';
import { TankHistoryService } from './tank-history.service';
import { DeviceTankUpdateType } from '../interfaces';
import { MysqlSender } from '../../devices/classes/mysql.sender';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { dateWithTimeZone } from '../../common/utility/date';
import * as iconv from 'iconv-lite';

@Injectable()
export class TankService extends CommonService<Tank> {
  constructor(
    @InjectRepository(Tank)
    private tankRepository: Repository<Tank>,
    private readonly tankHistoryService: TankHistoryService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
  ) {
    super();
  }

  getRepository(): Repository<Tank> {
    return this.tankRepository;
  }

  async updateState(addressId: number, payload: DeviceInfoType): Promise<void> {
    const tank = await this.tankRepository.findOne({
      where: { addressId },
      relations: {
        fuelHolder: true,
        fuel: true,
        refinery: true,
      },
    });
    if (!tank) {
      return;
    }
    const tankData: DeviceTankUpdateType = {
      volume: Number(payload.VOLUME.toFixed(4)),
      temperature: Number(payload.TEMP.toFixed(4)),
      density: Number(payload.DENSITY.toFixed(4)),
      weight: Number(payload.WEIGHT.toFixed(4)),
      level: Number(payload.LAYER_FLOAT.toFixed(4)),
    };

    await this.update(
      { where: { id: tank.id } },
      { ...tankData, isBlocked: true, error: '' },
    );
    if (Math.abs(tank.volume - payload.VOLUME) >= MIN_DIFF_VOLUME) {
      await this.tankHistoryService.create({
        fuel: tank.fuel,
        fuelHolder: tank.fuelHolder,
        refinery: tank.refinery,
        tank: { id: tank.id },
        volume: tankData.volume,
        temperature: tankData.temperature,
        density: tankData.density,
        weight: tankData.weight,
        docWeight: tank.docWeight,
        docVolume: tank.docVolume,
      });
    } else {
      await this.update(
        { where: { id: tank.id } },
        { isBlocked: false, error: '' },
      );
    }
  }

  async sendToStatistic() {
    const tankList = await this.tankRepository.find({
      where: { addressId: Not(IsNull()), isEnabled: true },
      relations: {
        fuelHolder: true,
        fuel: true,
        refinery: true,
      },
    });

    //Лютая дичь, нужна на переходный период
    try {
      const connector = new MysqlSender();
      const shopKey = Number(this.configService.get('SHOP_KEY')) ?? 1;

      const shifts: Array<any> = await connector.makeQuery(`SELECT *
                                                FROM shift WHERE ShopKey = '${shopKey}' 
                                                ORDER BY ShiftKey DESC  LIMIT 1`);
      const lastShift = shifts[0];

      if (lastShift?.ShiftKey) {
        for (const tank of tankList) {
          let fuelName: string;
          fuelName = `${tank.fuel.name} ${tank.refinery.shortName} ${tank.fuelHolder.shortName}`;
          fuelName = iconv.decode(iconv.encode(fuelName, 'win1251'), 'latin1');
          await connector.makeQuery(`INSERT INTO fuelbalance
          (ShopKey, ShiftKey, CreateDatetime, COD_L, COD_Q, COD_NB, COD_AZS, CollectionKey,
          ResourceCode, WarehouseKey, VolumeBalance, MassBalance, FreeVolumeBalance, VolumeSelling,
          MassSelling, CurrentPrice, VolumeMaximum, ResourceName, VolumeReal, MassReal)
          VALUES (${shopKey}, ${
            lastShift.ShiftKey
          }, '${dateWithTimeZone().toISOString()}', 1, 1, 1, 1, 6, 139, ${
            tank.sortIndex
          }, ${tank.volume}, ${tank.weight}, ${
            tank.totalVolume - tank.volume
          }, 0, 0, 0 , ${tank.totalVolume}, '${fuelName}', ${tank.volume}, ${
            tank.weight
          });`);

          await connector.makeQuery(`INSERT INTO warehousemeasurement
          (MeasurementDateTime, MeasurementType,
           ShopKey, ShiftKey,WarehouseKey, Level, TotalVolume,
           WaterVolume, Density, Temperature, Mass, CalcLevel,
           CalcTotalVolume, CalcWaterVolume, CalcDensity, CalcTemperature, CalcMass,
           LevelgageInfoMask, Flags, PosAcquirerID)
          VALUES ('${dateWithTimeZone().toISOString()}', 0, ${shopKey}, ${
            lastShift.ShiftKey
          }, ${tank.sortIndex}, ${tank.level}, ${tank.volume}, 0, ${
            tank.density
          }, ${tank.temperature}, ${tank.weight / 1000}, ${
            tank.volume
          }, ${Number(tank.level.toFixed(2))}, 0, ${tank.density}, ${
            tank.temperature
          }, ${tank.weight.toFixed(2)}, 31, 2, 172);`);
        }
      }

      connector.destroy();
    } catch (e) {
      console.error(e);
      this.logger.error(e);
    }
  }
}
