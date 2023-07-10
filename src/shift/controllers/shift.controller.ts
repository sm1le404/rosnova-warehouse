import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import {
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

@ApiTags('Shift')
@Controller('shift')
@UseInterceptors(ClassSerializerInterceptor)
export class ShiftController {
  constructor(
    private readonly shiftService: ShiftService,
    private readonly eventService: EventService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get shift list',
  })
  @ApiResponse({ type: Shift, isArray: true })
  async findAll(): Promise<Shift[]> {
    return this.shiftService.find({});
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get shift by id',
  })
  @ApiResponse({ type: Shift })
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
  @ApiResponse({ type: Shift })
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
      name: '',
      shift: user.lastShift,
    });

    return response;
  }

  @Put(':id')
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Update shift by id',
  })
  @ApiResponse({ type: Shift })
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
      collection: EventCollectionType.OUTCOME,
      type: EventType.UPDATE,
      dataBefore: JSON.stringify(dataBefore),
      dataAfter: JSON.stringify(updateShiftDto),
      name: '',
      shift: user.lastShift,
    });

    return updated;
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Delete shift by id',
  })
  @ApiResponse({ type: Shift })
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
      name: '',
      shift: user.lastShift,
    });

    return this.shiftService.delete({ where: { id } });
  }
}
