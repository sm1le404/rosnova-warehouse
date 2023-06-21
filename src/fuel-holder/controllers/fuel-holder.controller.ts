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
import { FuelHolderService } from '../services/fuel-holder.service';
import { FuelHolder } from '../entities/fuel-holder.entity';
import { CreateFuelHolderDto } from '../dto/create-fuel-holder.dto';
import { UpdateFuelHolderDto } from '../dto/update-fuel-holder.dto';

@ApiTags('Fuel-holder')
@Controller('fuel-holder')
@UseInterceptors(ClassSerializerInterceptor)
export class FuelHolderController {
  constructor(private readonly fuelHolderService: FuelHolderService) {}

  @Get()
  @ApiOperation({
    description: 'Get fuel-holder list',
  })
  @ApiResponse({ type: FuelHolder, isArray: true })
  async findAll(): Promise<FuelHolder[]> {
    return this.fuelHolderService.find({});
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get fuel-holder by id',
  })
  @ApiResponse({ type: FuelHolder })
  async findOne(@Param('id') id: number): Promise<FuelHolder> {
    return this.fuelHolderService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add fuel-holder',
  })
  @ApiResponse({ type: FuelHolder })
  async create(
    @Body() createFuelHolderDto: CreateFuelHolderDto,
  ): Promise<FuelHolder> {
    return this.fuelHolderService.create(createFuelHolderDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update fuel-holder by id',
  })
  @ApiResponse({ type: FuelHolder })
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
  @ApiResponse({ type: FuelHolder })
  async delete(@Param('id') id: number): Promise<FuelHolder> {
    return this.fuelHolderService.delete({ where: { id } });
  }
}
