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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SupplyService } from '../services/supply.service';
import { Supply } from '../entities/supply.entity';
import { CreateSupplyDto, ResponseSupplyDto, UpdateSupplyDto } from '../dto';
import { CommonPagination } from '../../common/decorators';
import {
  PaginationSupply,
  PaginationSupplyParams,
} from '../classes/pagination-supply.params';
import { Paginate } from 'nestjs-paginate';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { EventService } from '../../event/services/event.service';
import { EventCollectionType, EventType } from '../../event/enums';
import { ICurrentUser } from '../../auth/interface/current-user.interface';
import { JwtAuthGuard } from '../../auth/guard';

@ApiTags('Supply')
@Controller('supply')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class SupplyController {
  constructor(
    private readonly supplyService: SupplyService,
    private readonly eventService: EventService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get supply list',
  })
  @CommonPagination(
    PaginationSupplyParams.filterableColumns,
    PaginationSupplyParams.searchableColumns,
    PaginationSupplyParams.sortableColumns,
  )
  @ApiResponse({ type: ResponseSupplyDto })
  async findAll(
    @Paginate() paginationPayload: PaginationSupply,
  ): Promise<ResponseSupplyDto> {
    return this.supplyService.findPagination(paginationPayload);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get supply by id',
  })
  @ApiResponse({ type: Supply })
  async findOne(@Param('id') id: number): Promise<Supply> {
    return this.supplyService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add supply',
  })
  @ApiResponse({ type: Supply })
  async create(
    @Body() createSupplyDto: CreateSupplyDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Supply> {
    const response = await this.supplyService.create(createSupplyDto);

    await this.eventService.create({
      collection: EventCollectionType.SUPPLY,
      type: EventType.CREATE,
      dataBefore: '',
      dataAfter: JSON.stringify(createSupplyDto),
      name: String(createSupplyDto.numberTTN),
      shift: user.lastShift,
    });

    return response;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update supply by id',
  })
  @ApiResponse({ type: Supply })
  async update(
    @Param('id') id: number,
    @Body() updateSupplyDto: UpdateSupplyDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Supply> {
    const dataBefore = await this.findOne(id);

    const updated = await this.supplyService.update(
      {
        where: {
          id,
        },
      },
      updateSupplyDto,
    );

    await this.eventService.create({
      collection: EventCollectionType.SUPPLY,
      type: EventType.UPDATE,
      dataBefore: JSON.stringify(dataBefore),
      dataAfter: JSON.stringify(updateSupplyDto),
      name: String(updateSupplyDto.numberTTN),
      shift: user.lastShift,
    });

    return updated;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete supply by id',
  })
  @ApiResponse({ type: Supply })
  async delete(
    @Param('id') id: number,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Supply> {
    const dataBefore = await this.findOne(id);

    await this.eventService.create({
      collection: EventCollectionType.SUPPLY,
      type: EventType.DELETE,
      dataBefore: JSON.stringify(dataBefore),
      dataAfter: '',
      name: String(dataBefore.numberTTN),
      shift: user.lastShift,
    });

    return this.supplyService.delete({ where: { id } });
  }
}
