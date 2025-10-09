import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Fuel } from './fuel/entities/fuel.entity';
import { FuelHolder } from './fuel-holder/entities/fuel-holder.entity';
import { Refinery } from './refinery/entities/refinery.entity';
import { Dock } from './dock/entities/dock.entity';
import { Vehicle } from './vehicle/entities/vehicle.entity';
import { Carrier } from './carrier/entities/carrier.entity';
import { Dispenser } from './dispenser/entities/dispenser.entity';
import { Trailer } from './vehicle/entities/trailer.entity';
import { Settings } from './settings/entities/settings.entity';
import { Tank } from './tank/entities/tank.entity';
import { Driver } from './driver/entities/driver.entity';
import { TrailerType, VehicleType } from './vehicle/enums';
import { SettingsKey } from './settings/enums';
import { DispenserDeviceTypes, TankTypeEnum } from './devices/enums';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async issetData(): Promise<boolean> {
    const dispenserRepository = this.dataSource.getRepository(Dispenser);
    const dispenserExist = await dispenserRepository.find({});
    return !!dispenserExist.length;
  }

  async addDemoData(): Promise<void> {
    const dispenserRepository = this.dataSource.getRepository(Dispenser);
    const driverRepository = this.dataSource.getRepository(Driver);
    const refineryRepository = this.dataSource.getRepository(Refinery);
    const fuelHolderRepository = this.dataSource.getRepository(FuelHolder);
    const fuelRepository = this.dataSource.getRepository(Fuel);
    const vehicleRepository = this.dataSource.getRepository(Vehicle);
    const trailerRepository = this.dataSource.getRepository(Trailer);
    const dockRepository = this.dataSource.getRepository(Dock);
    const carrierRepository = this.dataSource.getRepository(Carrier);
    const tankRepository = this.dataSource.getRepository(Tank);
    const settingsRepository = this.dataSource.getRepository(Settings);

    // Создание колонок
    const dispenser1 = dispenserRepository.create({
      sortIndex: 1,
      currentCounter: 0,
      isEnabled: true,
      addressId: 1,
      comId: 1,
    });
    await dispenserRepository.save(dispenser1);

    const dispenser2 = dispenserRepository.create({
      sortIndex: 2,
      currentCounter: 0,
      isEnabled: true,
      addressId: 2,
      comId: 1,
    });
    await dispenserRepository.save(dispenser2);

    // Создание видов топлива
    const fuel1 = fuelRepository.create({
      name: 'ДТ-Л-К5',
      fullName:
        'Дизельное топливо ЕВРО, летнее, сорта С, экологического класса К5 марки (ДТ-Л-К5)',
      isEnabled: true,
    });
    await fuelRepository.save(fuel1);

    const fuel2 = fuelRepository.create({
      name: 'ТС-1',
      fullName: 'Топливо для реактивных двигателей',
      isEnabled: true,
    });
    await fuelRepository.save(fuel2);

    // Создание владельцев топлива
    const fuelHolder1 = fuelHolderRepository.create({
      fullName: 'ООО СК ГРУП',
      shortName: 'СК',
      isEnabled: true,
      inn: '123456789',
      requisites: 'Полные реквизиты юр лица ООО СК ГРУП',
    });
    await fuelHolderRepository.save(fuelHolder1);

    const fuelHolder2 = fuelHolderRepository.create({
      fullName: 'ООО ТК ГРУП',
      shortName: 'ТК',
      isEnabled: true,
      inn: '123456781',
      requisites: 'Полные реквизиты юр лица ООО ТК ГРУП',
    });
    await fuelHolderRepository.save(fuelHolder2);

    // Создание заводов изготовителей топлива
    const refinery1 = refineryRepository.create({
      fullName: 'ООО "Газпромнефть"',
      shortName: 'ГПН',
      isEnabled: true,
    });
    await refineryRepository.save(refinery1);

    const refinery2 = refineryRepository.create({
      fullName: 'ООО "Томская топливная компания"',
      shortName: 'ООО ТТК',
      isEnabled: true,
    });
    await refineryRepository.save(refinery2);

    //Создание водителей
    const driver1 = driverRepository.create({
      lastName: 'Иванов',
      firstName: 'Иван',
      middleName: 'Иванович',
      isEnabled: true,
    });
    await driverRepository.save(driver1);

    const driver2 = driverRepository.create({
      lastName: 'Николаев',
      firstName: 'Николай',
      middleName: 'Николаевич',
      isEnabled: true,
    });
    await driverRepository.save(driver2);

    //Создание прицепа
    // @ts-ignore
    const trailer1 = trailerRepository.create({
      regNumber: 'АМ 1950 777',
      currentState: null,
      sectionVolumes: [{ index: 1, volume: 31650 }],
      isEnabled: true,
      type: TrailerType.TRAILER,
      trailerModel: '',
    });
    await trailerRepository.save(trailer1);

    //Создание транспорта
    // @ts-ignore
    const vehicle1 = vehicleRepository.create({
      type: VehicleType.WAGON,
      driver: null,
      trailer: null,
      currentState: '',
      sectionVolumes: [],
      carModel: 'ЖД Вагон',
      regNumber: 'Вагон 5',
      isEnabled: true,
    });
    await vehicleRepository.save(vehicle1);

    // @ts-ignore
    const vehicle2 = vehicleRepository.create({
      type: VehicleType.LOADER,
      driver: {
        id: 1,
      },
      trailer: null,
      currentState: null,
      sectionVolumes: [
        { index: 1, volume: 6020 },
        { index: 2, volume: 6026 },
      ],
      carModel: 'SCANIA',
      regNumber: 'О 233 ОО 77',
      isEnabled: true,
    });
    await vehicleRepository.save(vehicle2);

    // @ts-ignore
    const vehicle3 = vehicleRepository.create({
      type: VehicleType.TRUCK,
      driver: {
        id: 2,
      },
      trailer: {
        id: 1,
      },
      currentState: null,
      sectionVolumes: [],
      carModel: 'КАМАЗ',
      regNumber: 'Р 100 РР 777',
      isEnabled: true,
    });
    await vehicleRepository.save(vehicle3);

    //Создание места отгрузки
    const dock1 = dockRepository.create({
      fullName: 'Нефтебаза ОМР',
      shortName: 'НОМР',
      isEnabled: true,
    });
    await dockRepository.save(dock1);

    //Создание перевозчика
    const carrier1 = carrierRepository.create({
      fullName: 'ООО ТК СТРИЖ',
      shortName: 'СТ-СТРИЖ',
      isEnabled: true,
    });
    await carrierRepository.save(carrier1);

    //Создание резервуаров
    const tank1 = tankRepository.create({
      fuel: {
        id: 1,
      },
      fuelHolder: {
        id: 1,
      },
      refinery: {
        id: 1,
      },
      sortIndex: 1,
      comId: 2,
      addressId: 1,
      totalVolume: 100000,
      isEnabled: true,
      deathBalance: 500,
      volume: 35000,
      temperature: 12,
      density: 0.803,
      weight: 120405,
      level: 1500,
    });
    await tankRepository.save(tank1);

    const tank2 = tankRepository.create({
      fuel: {
        id: 2,
      },
      fuelHolder: {
        id: 2,
      },
      refinery: {
        id: 2,
      },
      sortIndex: 2,
      comId: 2,
      addressId: 2,
      totalVolume: 200000,
      isEnabled: true,
      deathBalance: 1500,
      volume: 99000,
      temperature: 10,
      density: 0.823,
      weight: 81477,
      level: 1500,
    });
    await tankRepository.save(tank2);

    //Запись настроек
    const dispenserSetting = await settingsRepository.findOne({
      where: {
        key: SettingsKey.DISPENSER_TYPE,
      },
    });
    if (dispenserSetting) {
      await settingsRepository.update(
        {
          id: dispenserSetting.id,
        },
        {
          value: DispenserDeviceTypes.DEMO,
        },
      );
    } else {
      const dispenserSettingObj = await settingsRepository.create({
        key: SettingsKey.DISPENSER_TYPE,
        value: DispenserDeviceTypes.DEMO,
      });
      await settingsRepository.save(dispenserSettingObj);
    }

    const tankSetting = await settingsRepository.findOne({
      where: {
        key: SettingsKey.TANK_TYPE,
      },
    });
    if (tankSetting) {
      await settingsRepository.update(
        {
          id: tankSetting.id,
        },
        {
          value: TankTypeEnum.SENS,
        },
      );
    } else {
      const tankSettingObj = await settingsRepository.create({
        key: SettingsKey.TANK_TYPE,
        value: TankTypeEnum.SENS,
      });
      await settingsRepository.save(tankSettingObj);
    }
  }
}
