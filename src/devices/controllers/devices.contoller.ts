import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeviceTankService } from '../services/device.tank.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { DeviceDispenserService } from '../services/device.dispenser.service';
import { DispenserCommandDto } from '../dto/dispenser.command.dto';
import { DispenserGetFuelDto } from '../dto/dispenser.get.fuel.dto';
import { JwtAuthGuard } from '../../auth/guard';
import { HasRole } from '../../auth/guard/has-role.guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../../user/enums';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ICurrentUser } from '../../auth/interface/current-user.interface';
import { EventCollectionType, EventType } from '../../event/enums';
import { EventService } from '../../event/services/event.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TankUpdateStateEvent } from '../../tank/events/tank-update-state.event';
import { DeviceEvents } from '../enums/device-events.enum';
import { DispenserFixOperationDto } from '../dto/dispenser.fix.operation.dto';
import { KafkaProducerService } from '../../kafka/services';
import { CompressionTypes } from 'kafkajs';
import * as flatbuffers from 'flatbuffers';
import { Weapon } from '../../kafka/fbs/my-game/sample/weapon';

@ApiTags('Devices')
@Controller('devices')
export class DevicesContoller {
  constructor(
    private readonly deviceTankService: DeviceTankService,
    private readonly deviceDispenserService: DeviceDispenserService,
    private readonly eventService: EventService,
    private eventEmitter: EventEmitter2,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  @Get('kafka')
  async testKafka() {
    let builder = new flatbuffers.Builder(1024);
    let weaponOne = builder.createString('Sword s');
    // Create the first `Weapon` ('Sword').
    Weapon.startWeapon(builder);
    Weapon.addName(builder, weaponOne);
    Weapon.addDamage(builder, 100);
    let sword = Weapon.endWeapon(builder);
    builder.finish(sword);
    await this.kafkaProducerService.sendMessage({
      compression: CompressionTypes.None,
      messages: [{ value: Buffer.from(builder.asUint8Array()) }],
      topic: 'test.topic',
    });
  }

  @ApiExcludeEndpoint()
  @Get('tank')
  async testDevices() {
    //example test data b50120af01211740020d11c103d49c42047b6f42056d49420651573f077b6f420800000034
    setTimeout(() => {
      const buffTest = Buffer.from(
        'b50120af01211740020d11c103d49c42047b6f',
        'hex',
      );
      console.log(this.deviceTankService.readState(buffTest));
    }, 500);

    setTimeout(() => {
      const buffTest2 = Buffer.from(
        '42056d49420651573f077b6f420800000034',
        'hex',
      );
      const result = this.deviceTankService.readState(buffTest2);
      console.log(result);
      console.log(
        this.eventEmitter.emit(
          DeviceEvents.UPDATE_TANK_STATE,
          new TankUpdateStateEvent(1, result),
        ),
      );
      console.log(this.eventEmitter);
    }, 1500);
  }

  @Post('dispenser/callCommand')
  @UseGuards(JwtAuthGuard, HasRole)
  @UsePipes(new ValidationPipe())
  @SetRoles(RoleType.OPERATOR, RoleType.ADMIN)
  async callDispenserCommand(
    @Body() payload: DispenserCommandDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    await this.eventService.create({
      collection: EventCollectionType.CALL_DISPENSER_COMMAND,
      type: EventType.DEFAULT,
      dataBefore: '',
      dataAfter: JSON.stringify(payload),
      name: `Вызов произвольной команды`,
      shift: user.lastShift,
      user,
    });
    if (payload?.data && Array.isArray(payload.data)) {
      payload.data = Buffer.from(payload.data.join(''));
    }
    return this.deviceDispenserService.callCommand(payload);
  }

  @UseGuards(JwtAuthGuard, HasRole)
  @SetRoles(RoleType.OPERATOR, RoleType.ADMIN)
  @Post('dispenser/drain')
  async checkDispenserCommand(
    @Body() payload: DispenserGetFuelDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    await this.eventService.create({
      collection: EventCollectionType.DRAIN_FUEL,
      type: EventType.DEFAULT,
      dataBefore: '',
      dataAfter: JSON.stringify(payload),
      name: `Вызов команды на слив топлива`,
      shift: user.lastShift,
      user,
    });
    return this.deviceDispenserService.drainFuel(payload);
  }

  @UseGuards(JwtAuthGuard, HasRole)
  @SetRoles(RoleType.OPERATOR, RoleType.ADMIN)
  @Post('dispenser/done')
  async doneDispenserCommand(
    @Body() payload: DispenserFixOperationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    await this.eventService.create({
      collection: EventCollectionType.DRAIN_FUEL,
      type: EventType.DEFAULT,
      dataBefore: '',
      dataAfter: JSON.stringify(payload),
      name: `Вызов команды на фиксацию результата`,
      shift: user.lastShift,
      user,
    });
    return this.deviceDispenserService.doneOperation(payload);
  }

  @UseGuards(JwtAuthGuard, HasRole)
  @SetRoles(RoleType.OPERATOR, RoleType.ADMIN)
  @Post('dispenser/drain/test')
  async checkDispenserCommandTest(
    @Body() payload: DispenserGetFuelDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    await this.eventService.create({
      collection: EventCollectionType.DRAIN_FUEL,
      type: EventType.DEFAULT,
      dataBefore: '',
      dataAfter: JSON.stringify(payload),
      name: `Вызов команды на слив топлива`,
      shift: user.lastShift,
      user,
    });
    return this.deviceDispenserService.drainFuelTest(payload);
  }

  @UseGuards(JwtAuthGuard, HasRole)
  @SetRoles(RoleType.OPERATOR, RoleType.ADMIN)
  @Post('dispenser/done/test')
  async doneDispenserTestCommand(
    @Body() payload: DispenserFixOperationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    await this.eventService.create({
      collection: EventCollectionType.DRAIN_FUEL,
      type: EventType.DEFAULT,
      dataBefore: '',
      dataAfter: JSON.stringify(payload),
      name: `Вызов команды на фиксацию результата`,
      shift: user.lastShift,
      user,
    });
    return this.deviceDispenserService.doneOperationTest(payload);
  }
}
