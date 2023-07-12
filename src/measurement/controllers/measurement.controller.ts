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
import { MeasurementService } from '../services/measurement.service';
import { Measurement } from '../entities/measurement.entity';
import { CreateMeasurementDto, UpdateMeasurementDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../../user/enums';
import { HasRole } from '../../auth/guard/has-role.guard';
import { Paginate } from 'nestjs-paginate';
import { CommonPagination } from '../../common/decorators';
import {
  PaginationMeasurement,
  PaginationMeasurementParams,
} from '../classes/pagination-measurement.params';
import { ResponseMeasurementDto } from '../dto/response-measurement.dto';

@ApiTags('Measurement')
@Controller('measurement')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get measurement list',
  })
  @ApiResponse({ type: () => ResponseMeasurementDto })
  @CommonPagination(
    PaginationMeasurementParams.filterableColumns,
    PaginationMeasurementParams.searchableColumns,
    PaginationMeasurementParams.sortableColumns,
  )
  async findAll(
    @Paginate() paginationPayload: PaginationMeasurement,
  ): Promise<ResponseMeasurementDto> {
    return this.measurementService.findPagination(paginationPayload);
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get measurement by id',
  })
  @ApiResponse({ type: () => Measurement })
  async findOne(@Param('id') id: number): Promise<Measurement> {
    return this.measurementService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add measurement',
  })
  @ApiResponse({ type: () => Measurement })
  async create(
    @Body() createMeasurementDto: CreateMeasurementDto,
  ): Promise<Measurement> {
    return this.measurementService.create(createMeasurementDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update measurement by id',
  })
  @ApiResponse({ type: () => Measurement })
  async update(
    @Param('id') id: number,
    @Body() updateMeasurementDto: UpdateMeasurementDto,
  ): Promise<Measurement> {
    return this.measurementService.update(
      {
        where: {
          id,
        },
      },
      updateMeasurementDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete measurement by id',
  })
  @ApiResponse({ type: () => Measurement })
  async delete(@Param('id') id: number): Promise<Measurement> {
    return this.measurementService.delete({ where: { id } });
  }
}
