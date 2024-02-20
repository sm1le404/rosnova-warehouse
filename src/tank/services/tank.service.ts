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
import { KafkaService } from '../../kafka/services';
import { WhTankStateDto } from 'rs-dto/lib/warehouse/dto/tank.state.dto';
import { CompressionTypes, Message } from 'kafkajs';
import { HubTopics } from 'rs-dto';

@Injectable()
export class TankService extends CommonService<Tank> {
  constructor(
    @InjectRepository(Tank)
    private tankRepository: Repository<Tank>,
    private readonly tankHistoryService: TankHistoryService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private readonly kafkaService: KafkaService,
  ) {
    super();
  }

  getRepository(): Repository<Tank> {
    return this.tankRepository;
  }

  private static checkValues(payload: DeviceTankUpdateType): boolean {
    let flag = true;
    Object.keys(payload).forEach((key) => {
      if (
        payload[key] > 1000000 ||
        payload[key] < -1000000 ||
        isNaN(payload[key])
      ) {
        flag = false;
      }
    });
    //Проскакивают иногда некорректные значения веса, уровня и объема
    if (
      Math.round(payload.volume) === 0 ||
      Math.round(payload.weight) === 0 ||
      Math.round(payload.level) <= 0
    ) {
      flag = false;
    }
    return flag;
  }

  async updateState(addressId: number, payload: DeviceInfoType): Promise<void> {
    try {
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

      if (!TankService.checkValues(tankData)) {
        return;
      }

      await this.update(
        { where: { id: tank.id } },
        {
          ...tankData,
          isBlocked: Math.abs(tank.volume - tankData.volume) >= MIN_DIFF_VOLUME,
          error: null,
        },
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  async sendToHubStatistic() {
    const tankList = await this.tankRepository.find({
      where: { addressId: Not(IsNull()), isEnabled: true },
    });
    const messages: Array<Message> = [];
    for (const tank of tankList) {
      const kafkaMessage: WhTankStateDto = {
        id: tank.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        sortIndex: tank.sortIndex,
        temperature: tank.temperature,
        volume: tank.volume,
        weight: tank.weight,
        docVolume: tank.docVolume,
        docWeight: tank.docWeight,
        density: tank.density,
        level: tank.level,
        whExternalCode: this.configService.get('SHOP_KEY'),
        fuelName: ``,
      };
      messages.push({ value: JSON.stringify(kafkaMessage) });
    }
    if (messages.length) {
      await this.kafkaService.addMessage({
        compression: CompressionTypes.GZIP,
        messages,
        topic: HubTopics.TANK_STATE,
      });
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
      this.logger.error(e);
    }
  }
}
