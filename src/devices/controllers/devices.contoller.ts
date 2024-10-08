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
import { ApiTags } from '@nestjs/swagger';
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
import { DispenserFixOperationDto } from '../dto/dispenser.fix.operation.dto';
import { KafkaService } from '../../kafka/services';
import { DispenserCommandDtoExt } from '../dto/dispenser.command.dto.ext';
import { DeviceDispenserService, DeviceTankService } from '../services';

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

  @Get('tank/:comId/:addressId')
  async readTankState(
    @Param('addressId') addressId: number,
    @Param('comId') comId: number,
  ) {
    await this.deviceTankService.readCommand(addressId, comId);
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
