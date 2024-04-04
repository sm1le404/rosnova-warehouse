import {
  Body,
  Controller,
  Get,
  Param,
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
import { TankUpdateStateEvent } from '../../tank/events';
import { DeviceEvents } from '../enums/device-events.enum';
import { DispenserFixOperationDto } from '../dto/dispenser.fix.operation.dto';
import { CompressionTypes } from 'kafkajs';
import { KafkaService } from '../../kafka/services';
import { HubTopics } from 'rs-dto';
import { DispenserCommandDtoExt } from '../dto/dispenser.command.dto.ext';

@ApiTags('Devices')
@Controller('devices')
export class DevicesContoller {
  constructor(
    private readonly deviceTankService: DeviceTankService,
    private readonly deviceDispenserService: DeviceDispenserService,
    private readonly eventService: EventService,
    private eventEmitter: EventEmitter2,
    private readonly kafkaService: KafkaService,
  ) {}

  @ApiExcludeEndpoint()
  @Get('kafka')
  async testKafka() {
    let data = { test: 1, num: 'string' };
    await this.kafkaService.addMessage({
      compression: CompressionTypes.GZIP,
      messages: [
        {
          value: JSON.stringify(data),
          headers: {
            TO: `WH_1`,
          },
        },
      ],
      topic: HubTopics.TANK_STATE,
    });
  }

  @ApiExcludeEndpoint()
  @Get('tank/test')
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

  @Get('tank/:addressId')
  async readTankState(@Param('addressId') addressId: number) {
    await this.deviceTankService.readTankByAddress(addressId);
  }

  @Post('dispenser/callCommandExt')
  @UseGuards(JwtAuthGuard, HasRole)
  @UsePipes(new ValidationPipe())
  @SetRoles(RoleType.OPERATOR, RoleType.ADMIN)
  async callDispenserCommandExt(
    @Body() payload: DispenserCommandDtoExt,
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
    return this.deviceDispenserService.callCommandExt(payload);
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
    return this.deviceDispenserService.drainFuel({
      ...payload,
      userId: user.id,
    });
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
