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
import { DriverService } from '../services/driver.service';
import { Driver } from '../entities/driver.entity';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { UpdateDriverDto } from '../dto/update-driver.dto';

@ApiTags('Driver')
@Controller('driver')
@UseInterceptors(ClassSerializerInterceptor)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @ApiOperation({
    description: 'Get drivers list',
  })
  @ApiResponse({ type: Driver, isArray: true })
  async findAll(): Promise<Driver[]> {
    return this.driverService.find({});
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get driver by id',
  })
  @ApiResponse({ type: Driver })
  async findOne(@Param('id') id: number): Promise<Driver> {
    return this.driverService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add driver',
  })
  @ApiResponse({ type: Driver })
  async create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driverService.create(createDriverDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update driver by id',
  })
  @ApiResponse({ type: Driver })
  async update(
    @Param('id') id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ): Promise<Driver> {
    return this.driverService.update(
      {
        where: {
          id,
        },
      },
      updateDriverDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete driver by id',
  })
  @ApiResponse({ type: Driver })
  async delete(@Param('id') id: number): Promise<Driver> {
    return this.driverService.delete({ where: { id } });
  }
}
