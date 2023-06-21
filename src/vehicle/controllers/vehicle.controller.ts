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
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto';
  
  @ApiTags('Vehicle')
  @Controller('vehicle')
  @UseInterceptors(ClassSerializerInterceptor)
  export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) {}
  
    @Get()
    @ApiOperation({
      description: 'Get fuel-holder list',
    })
    @ApiResponse({ type: Vehicle, isArray: true })
    async findAll(): Promise<Vehicle[]> {
      return this.vehicleService.find({});
    }
  
    @Get(':id')
    @ApiOperation({
      description: 'Get fuel-holder by id',
    })
    @ApiResponse({ type: Vehicle })
    async findOne(@Param('id') id: number): Promise<Vehicle> {
      return this.vehicleService.findOne({
        where: {
          id,
        },
      });
    }
  
    @Post()
    @ApiOperation({
      summary: 'Add fuel-holder',
    })
    @ApiResponse({ type: Vehicle })
    async create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
      return this.vehicleService.create(createVehicleDto);
    }
  
    @Put(':id')
    @ApiOperation({
      summary: 'Update fuel-holder by id',
    })
    @ApiResponse({ type: Vehicle })
    async update(
      @Param('id') id: number,
      @Body() updateVehicleDto: UpdateVehicleDto,
    ): Promise<Vehicle> {
      return this.vehicleService.update(
        {
          where: {
            id,
          },
        },
        updateVehicleDto,
      );
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Delete fuel holder by id',
    })
    @ApiResponse({ type: Vehicle })
    async delete(@Param('id') id: number): Promise<Vehicle> {
      return this.vehicleService.delete({ where: { id } });
    }
  }
  