import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../../user/enums';
import { JwtAuthGuard } from '../../auth/guard';
import { HasRole } from '../../auth/guard/has-role.guard';

@ApiTags('Vehicle')
@Controller('vehicle')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get vehicle list',
  })
  @ApiResponse({ type: () => Vehicle, isArray: true })
  async findAll(): Promise<Vehicle[]> {
    return this.vehicleService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get vehicle by id',
  })
  @ApiResponse({ type: () => Vehicle })
  async findOne(@Param('id') id: number): Promise<Vehicle> {
    return this.vehicleService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Add vehicle',
  })
  @ApiResponse({ type: () => Vehicle })
  async create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehicleService.create(createVehicleDto);
  }

  @Put(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Update vehicle by id',
  })
  @ApiResponse({ type: () => Vehicle })
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
    summary: 'Delete vehicle by id',
  })
  @ApiResponse({ type: () => Vehicle })
  async delete(@Param('id') id: number): Promise<Vehicle> {
    return this.vehicleService.delete({ where: { id } });
  }

  @Get('kafka')
  async sendToKafkaByDate(
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
  ) {
    await this.vehicleService.uploadByDateToKafka(dateFrom, dateTo);
  }

  @Get('kafka/:limit')
  async sendToKafka(@Param('limit') limit: number) {
    await this.vehicleService.uploadAllToKafka(limit);
  }
}
