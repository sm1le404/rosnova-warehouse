import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShiftService } from '../services/shift.service';
import { Shift } from '../entities/shift.entity';
import { CreateShiftDto, UpdateShiftDto } from '../dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { EventService } from '../../event/services/event.service';
import { EventCollectionType, EventType } from '../../event/enums';
import { ICurrentUser } from '../../auth/interface/current-user.interface';
import {
  PaginationShift,
  PaginationShiftParams,
} from '../classes/pagination-shift.params';
import { ResponseShiftDto } from '../dto/response-shift.dto';
import { Paginate } from 'nestjs-paginate';
import { CommonPagination } from '../../common/decorators';
import { JwtAuthGuard } from '../../auth/guard';
import { HasRole } from '../../auth/guard/has-role.guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../../user/enums';
import { DeviceDispenserService } from '../../devices/services/device.dispenser.service';
import { DispenserService } from '../../dispenser/services/dispenser.service';
import { TankService } from '../../tank/services/tank.service';
import { CloseShiftDto } from '../dto/close.shift.dto';

@ApiTags('Shift')
@Controller('shift')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class ShiftController {
  constructor(
    private readonly shiftService: ShiftService,
    private readonly eventService: EventService,
    private readonly deviceDispenserService: DeviceDispenserService,
    private readonly dispenserService: DispenserService,
    private readonly tankService: TankService,
  ) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get shift list',
  })
  @ApiResponse({ type: () => ResponseShiftDto })
  @CommonPagination(
    PaginationShiftParams.filterableColumns,
    PaginationShiftParams.searchableColumns,
    PaginationShiftParams.sortableColumns,
  )
  async findAll(
    @Paginate() paginationPayload: PaginationShift,
  ): Promise<ResponseShiftDto> {
    return this.shiftService.findPagination(paginationPayload);
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get shift by id',
  })
  @ApiResponse({ type: () => Shift })
  async findOne(@Param('id') id: number): Promise<Shift> {
    return this.shiftService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Add shift',
  })
  @ApiResponse({ type: () => Shift })
  async create(
    @Body() createShiftDto: CreateShiftDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Shift> {
    const response = await this.shiftService.create(createShiftDto);

    await this.eventService.create({
      collection: EventCollectionType.SHIFT,
      type: EventType.CREATE,
      dataBefore: '',
      dataAfter: JSON.stringify(createShiftDto),
      name: 'Создание смены',
      shift: user.lastShift,
      user,
    });

    return response;
  }

  @Put(':id')
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Update shift by id',
  })
  @ApiResponse({ type: () => Shift })
  async update(
    @Param('id') id: number,
    @Body() updateShiftDto: UpdateShiftDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Shift> {
    const dataBefore = await this.findOne(id);

    const updated = await this.shiftService.update(
      {
        where: {
          id,
        },
      },
      updateShiftDto,
    );

    await this.eventService.create({
      collection: EventCollectionType.SHIFT,
      type: EventType.UPDATE,
      dataBefore: JSON.stringify(dataBefore),
      dataAfter: JSON.stringify(updateShiftDto),
      name: 'Изменение смены',
      shift: user.lastShift,
      user,
    });

    return updated;
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Delete shift by id',
  })
  @ApiResponse({ type: () => Shift })
  async delete(
    @Param('id') id: number,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Shift> {
    const dataBefore = await this.findOne(id);

    await this.eventService.create({
      collection: EventCollectionType.SHIFT,
      type: EventType.DELETE,
      dataBefore: JSON.stringify(dataBefore),
      dataAfter: '',
      name: 'Удаление смены',
      shift: user.lastShift,
      user,
    });

    return this.shiftService.delete({ where: { id } });
  }

  @Post('close')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Close current shift',
  })
  @ApiBody({
    type: () => CloseShiftDto,
  })
  @ApiResponse({ type: () => Shift })
  async close(
    @CurrentUser() user: ICurrentUser,
    @Body() closeShiftDto: CloseShiftDto,
  ): Promise<Shift> {
    try {
      await this.deviceDispenserService.updateDispenserSummary();
    } catch (e) {}

    const dispensers = await this.dispenserService.find({
      select: { id: true, currentCounter: true },
    });

    const tanks = await this.tankService.find({
      where: { isEnabled: true },
      relations: {
        fuel: true,
        fuelHolder: true,
        refinery: true,
      },
    });

    const updated = await this.shiftService.update(
      {
        where: {
          id: user.lastShift.id,
        },
      },
      {
        startDispensersState: JSON.stringify(
          user.lastShift.startDispensersState,
        ),
        closedAt: Math.floor(Date.now() / 1000),
        finishDispensersState: JSON.stringify(
          dispensers.map((item) => {
            return {
              id: item.id,
              summary: item.currentCounter,
            };
          }),
        ),
        finishTankState: JSON.stringify(
          tanks.map((item) => {
            return {
              id: item.id,
              sortIndex: item.sortIndex,
              volume: item.volume,
              weight: item.weight,
              docVolume: item.docVolume,
              docWeight: item.docWeight,
              fuelId: item.fuel.id,
              fuelHolderId: item.fuelHolder.id,
              refineryId: item.refinery.id,
            };
          }),
        ),
        manualTankState: JSON.stringify(closeShiftDto.manualMeasurements),
      },
    );

    await this.eventService.create({
      collection: EventCollectionType.SHIFT,
      type: EventType.DEFAULT,
      dataBefore: '',
      dataAfter: '',
      name: 'Закрытие смены',
      shift: user.lastShift,
      user,
    });

    return updated;
  }
}
