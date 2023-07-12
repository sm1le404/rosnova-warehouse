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
import { FuelService } from '../services/fuel.service';
import { Fuel } from '../entities/fuel.entity';
import { CreateFuelDto } from '../dto/create-fuel.dto';
import { UpdateFuelDto } from '../dto/update-fuel.dto';
import { JwtAuthGuard } from '../../auth/guard';
import { RoleType } from '../../user/enums';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { HasRole } from '../../auth/guard/has-role.guard';

@ApiTags('Fuel')
@Controller('fuel')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get fuel list',
  })
  @ApiResponse({ type: () => Fuel, isArray: true })
  async findAll(): Promise<Fuel[]> {
    return this.fuelService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get fuel by id',
  })
  @ApiResponse({ type: () => Fuel })
  async findOne(@Param('id') id: number): Promise<Fuel> {
    return this.fuelService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add fuel type',
  })
  @ApiResponse({ type: () => Fuel })
  async create(@Body() createFuelDto: CreateFuelDto): Promise<Fuel> {
    return this.fuelService.create(createFuelDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update fuel by id',
  })
  @ApiResponse({ type: () => Fuel })
  async update(
    @Param('id') id: number,
    @Body() updateFuelDto: UpdateFuelDto,
  ): Promise<Fuel> {
    return this.fuelService.update(
      {
        where: {
          id,
        },
      },
      updateFuelDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete fuel by id',
  })
  @ApiResponse({ type: () => Fuel })
  async delete(@Param('id') id: number): Promise<Fuel> {
    return this.fuelService.delete({ where: { id } });
  }
}
