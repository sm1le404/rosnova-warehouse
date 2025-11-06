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
import { FuelHolderService } from '../services/fuel-holder.service';
import { FuelHolder } from '../entities/fuel-holder.entity';
import { CreateFuelHolderDto } from '../dto/create-fuel-holder.dto';
import { UpdateFuelHolderDto } from '../dto/update-fuel-holder.dto';
import { JwtAuthGuard } from '../../auth/guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../../user/enums';
import { HasRole } from '../../auth/guard/has-role.guard';

@ApiTags('Fuel-holder')
@Controller('fuel-holder')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class FuelHolderController {
  constructor(private readonly fuelHolderService: FuelHolderService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get fuel-holder list',
  })
  @ApiResponse({ type: () => FuelHolder, isArray: true })
  async findAll(): Promise<FuelHolder[]> {
    return this.fuelHolderService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get fuel-holder by id',
  })
  @ApiResponse({ type: () => FuelHolder })
  async findOne(@Param('id') id: number): Promise<FuelHolder> {
    return this.fuelHolderService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Add fuel-holder',
  })
  @ApiResponse({ type: () => FuelHolder })
  async create(
    @Body() createFuelHolderDto: CreateFuelHolderDto,
  ): Promise<FuelHolder> {
    return this.fuelHolderService.create(createFuelHolderDto);
  }

  @Put(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Update fuel-holder by id',
  })
  @ApiResponse({ type: () => FuelHolder })
  async update(
    @Param('id') id: number,
    @Body() updateFuelHolderDto: UpdateFuelHolderDto,
  ): Promise<FuelHolder> {
    return this.fuelHolderService.update(
      {
        where: {
          id,
        },
      },
      updateFuelHolderDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete fuel holder by id',
  })
  @ApiResponse({ type: () => FuelHolder })
  async delete(@Param('id') id: number): Promise<FuelHolder> {
    return this.fuelHolderService.delete({ where: { id } });
  }

  @Get('kafka')
  async sendToKafkaByDate(
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
  ) {
    await this.fuelHolderService.uploadByDateToKafka(dateFrom, dateTo);
  }

  @Get('kafka/:limit')
  async sendToKafka(@Param('limit') limit: number) {
    await this.fuelHolderService.uploadAllToKafka(limit);
  }
}
