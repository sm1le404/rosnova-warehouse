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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeasurementService } from '../services/measurement.service';
import { Measurement } from '../entities/measurement.entity';
import { CreateMeasurementDto, UpdateMeasurementDto } from '../dto';

@ApiTags('Measurement')
@Controller('measurement')
@UseInterceptors(ClassSerializerInterceptor)
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Get()
  @ApiOperation({
    summary: 'Get measurement list',
  })
  @ApiResponse({ type: Measurement, isArray: true })
  async findAll(): Promise<Measurement[]> {
    return this.measurementService.find({});
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get measurement by id',
  })
  @ApiResponse({ type: Measurement })
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
  @ApiResponse({ type: Measurement })
  async create(
    @Body() createMeasurementDto: CreateMeasurementDto,
  ): Promise<Measurement> {
    return this.measurementService.create(createMeasurementDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update measurement by id',
  })
  @ApiResponse({ type: Measurement })
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
  @ApiResponse({ type: Measurement })
  async delete(@Param('id') id: number): Promise<Measurement> {
    return this.measurementService.delete({ where: { id } });
  }
}
