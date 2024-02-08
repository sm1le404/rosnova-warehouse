import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OperationService } from '../services/operation.service';
import { Operation } from '../entities/operation.entity';
import {
  CreateOperationDto,
  ResponseOperationDto,
  UpdateOperationDto,
} from '../dto';
import {
  PaginationOperation,
  PaginationOperationParams,
} from '../classes/pagination-operation.params';
import { CommonPagination } from '../../common/decorators';
import { Paginate } from 'nestjs-paginate';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { EventService } from '../../event/services/event.service';
import { EventCollectionType, EventType } from '../../event/enums';
import { ICurrentUser } from '../../auth/interface/current-user.interface';
import { JwtAuthGuard } from '../../auth/guard';
import { HasRole } from '../../auth/guard/has-role.guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../../user/enums';
import { isOperatorLastShift } from '../../common/utility/is-operator-last-shift';
import { OperationStatus } from '../enums';

@ApiTags('Operation')
@Controller('operation')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.OPERATOR, RoleType.ADMIN)
export class OperationController {
  constructor(
    private readonly operationService: OperationService,
    private readonly eventService: EventService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get operation list',
  })
  @CommonPagination(
    PaginationOperationParams.filterableColumns,
    PaginationOperationParams.searchableColumns,
    PaginationOperationParams.sortableColumns,
  )
  @ApiResponse({ type: () => ResponseOperationDto })
  async findAll(
    @Paginate() paginationPayload: PaginationOperation,
  ): Promise<ResponseOperationDto> {
    return this.operationService.findPagination(paginationPayload);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get operation by id',
  })
  @ApiResponse({ type: () => Operation })
  async findOne(@Param('id') id: number): Promise<Operation> {
    return this.operationService.findOne({
      where: {
        id,
      },
      relations: PaginationOperationParams.relationList,
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add operation',
  })
  @ApiResponse({ type: () => Operation })
  async create(
    @Body() createOperationDto: CreateOperationDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Operation> {
    const response = await this.operationService.create({
      ...createOperationDto,
      shift: user.lastShift,
    });

    await this.eventService.create({
      collection: EventCollectionType.OPERATION,
      type: EventType.CREATE,
      dataBefore: '',
      dataAfter: JSON.stringify(createOperationDto),
      name: `Создание операции, накладная: ${createOperationDto.numberTTN}`,
      shift: user.lastShift,
      user,
    });

    return response;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update operation by id',
  })
  @ApiResponse({ type: () => Operation })
  async update(
    @Param('id') id: number,
    @Body() updateOperationDto: UpdateOperationDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Operation> {
    const dataBefore = await this.findOne(id);

    if (
      !isOperatorLastShift(user.role, dataBefore.shift.id, user.lastShift.id)
    ) {
      throw new ForbiddenException(
        'Недостаточно прав, чтобы редактировать операцию',
      );
    }

    const updated = await this.operationService.update(
      {
        where: {
          id,
        },
      },
      updateOperationDto,
    );

    await this.eventService.create({
      collection: EventCollectionType.OPERATION,
      type: EventType.UPDATE,
      dataBefore: JSON.stringify(dataBefore),
      dataAfter: JSON.stringify(updateOperationDto),
      name: `Изменение операции ${id}, накладная: ${dataBefore.numberTTN}`,
      shift: user.lastShift,
      user,
    });

    return updated;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete operation by id',
  })
  @ApiResponse({ type: () => Operation })
  async delete(
    @Param('id') id: number,
    @CurrentUser() user: ICurrentUser,
  ): Promise<any> {
    const dataBefore = await this.findOne(id);

    if (
      user.role === RoleType.OPERATOR &&
      user?.lastShift?.id !== dataBefore?.shift?.id
    ) {
      throw new BadRequestException(`Нельзя удалить операцию не в своей смене`);
    }

    if (
      user.role === RoleType.OPERATOR &&
      dataBefore.status === OperationStatus.FINISHED
    ) {
      throw new BadRequestException(`Нельзя удалить завершившуюся операцию`);
    }

    await this.eventService.create({
      collection: EventCollectionType.OPERATION,
      type: EventType.DELETE,
      dataBefore: JSON.stringify(dataBefore),
      dataAfter: '',
      name: `Удаление операции ${id}, накладная: ${dataBefore.numberTTN}`,
      shift: user.lastShift,
      user,
    });
    return this.operationService.delete({ where: { id } });
  }

  @Post('kafka')
  async sendToKafka() {
    await this.operationService.uploadAllToKafka();
  }
}
