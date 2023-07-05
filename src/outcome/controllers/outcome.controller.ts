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
import { OutcomeService } from '../services/outcome.service';
import { Outcome } from '../entities/outcome.entity';
import { CreateOutcomeDto, ResponseOutcomeDto, UpdateOutcomeDto } from '../dto';
import {
  PaginationOutcome,
  PaginationOutcomeParams,
} from '../classes/pagination-outcome.params';
import { CommonPagination } from '../../common/decorators';
import { Paginate } from 'nestjs-paginate';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { EventService } from '../../event/services/event.service';
import { EventCollectionType, EventType } from '../../event/enums';
import { ICurrentUser } from '../../auth/interface/current-user.interface';
import { JwtAuthGuard } from '../../auth/guard';

@ApiTags('Outcome')
@Controller('outcome')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class OutcomeController {
  constructor(
    private readonly outcomeService: OutcomeService,
    private readonly eventService: EventService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get outcome list',
  })
  @CommonPagination(
    PaginationOutcomeParams.filterableColumns,
    PaginationOutcomeParams.searchableColumns,
    PaginationOutcomeParams.sortableColumns,
  )
  @ApiResponse({ type: ResponseOutcomeDto })
  async findAll(
    @Paginate() paginationPayload: PaginationOutcome,
  ): Promise<ResponseOutcomeDto> {
    return this.outcomeService.findPagination(paginationPayload);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get outcome by id',
  })
  @ApiResponse({ type: Outcome })
  async findOne(@Param('id') id: number): Promise<Outcome> {
    return this.outcomeService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add outcome',
  })
  @ApiResponse({ type: Outcome })
  async create(
    @Body() createOutcomeDto: CreateOutcomeDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Outcome> {
    const response = await this.outcomeService.create(createOutcomeDto);

    await this.eventService.create({
      collection: EventCollectionType.OUTCOME,
      type: EventType.CREATE,
      dataBefore: '',
      dataAfter: JSON.stringify(createOutcomeDto),
      name: String(createOutcomeDto.numberTTN),
      shift: user.lastShift,
    });

    return response;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update outcome by id',
  })
  @ApiResponse({ type: Outcome })
  async update(
    @Param('id') id: number,
    @Body() updateOutcomeDto: UpdateOutcomeDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Outcome> {
    const dataBefore = await this.findOne(id);

    const updated = await this.outcomeService.update(
      {
        where: {
          id,
        },
      },
      updateOutcomeDto,
    );

    await this.eventService.create({
      collection: EventCollectionType.OUTCOME,
      type: EventType.UPDATE,
      dataBefore: JSON.stringify(dataBefore),
      dataAfter: JSON.stringify(updateOutcomeDto),
      name: String(updateOutcomeDto.numberTTN),
      shift: user.lastShift,
    });

    return updated;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete outcome by id',
  })
  @ApiResponse({ type: Outcome })
  async delete(
    @Param('id') id: number,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Outcome> {
    const dataBefore = await this.findOne(id);

    await this.eventService.create({
      collection: EventCollectionType.OUTCOME,
      type: EventType.DELETE,
      dataBefore: JSON.stringify(dataBefore),
      dataAfter: '',
      name: String(dataBefore.numberTTN),
      shift: user.lastShift,
    });
    return this.outcomeService.delete({ where: { id } });
  }
}
