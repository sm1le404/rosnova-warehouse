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
import { TankService } from '../services/tank.service';
import { Tank } from '../entities/tank.entity';
import { CreateTankDto, UpdateTankDto } from '../dto';

@ApiTags('Tank')
@Controller('tank')
@UseInterceptors(ClassSerializerInterceptor)
export class TankController {
  constructor(private readonly tankService: TankService) {}

  @Get()
  @ApiOperation({
    description: 'Get fuel-holder list',
  })
  @ApiResponse({ type: Tank, isArray: true })
  async findAll(): Promise<Tank[]> {
    return this.tankService.find({});
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get fuel-holder by id',
  })
  @ApiResponse({ type: Tank })
  async findOne(@Param('id') id: number): Promise<Tank> {
    return this.tankService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add fuel-holder',
  })
  @ApiResponse({ type: Tank })
  async create(@Body() createTankDto: CreateTankDto): Promise<Tank> {
    return this.tankService.create(createTankDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update fuel-holder by id',
  })
  @ApiResponse({ type: Tank })
  async update(
    @Param('id') id: number,
    @Body() updateTankDto: UpdateTankDto,
  ): Promise<Tank> {
    return this.tankService.update(
      {
        where: {
          id,
        },
      },
      updateTankDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete fuel holder by id',
  })
  @ApiResponse({ type: Tank })
  async delete(@Param('id') id: number): Promise<Tank> {
    return this.tankService.delete({ where: { id } });
  }
}
