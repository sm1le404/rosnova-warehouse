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
import { ShiftService } from '../services/shift.service';
import { Shift } from '../entities/shift.entity';
import { CreateShiftDto, UpdateShiftDto } from '../dto';

@ApiTags('Shift')
@Controller('shift')
@UseInterceptors(ClassSerializerInterceptor)
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Get()
  @ApiOperation({
    description: 'Get fuel-holder list',
  })
  @ApiResponse({ type: Shift, isArray: true })
  async findAll(): Promise<Shift[]> {
    return this.shiftService.find({});
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get fuel-holder by id',
  })
  @ApiResponse({ type: Shift })
  async findOne(@Param('id') id: number): Promise<Shift> {
    return this.shiftService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add fuel-holder',
  })
  @ApiResponse({ type: Shift })
  async create(@Body() createShiftDto: CreateShiftDto): Promise<Shift> {
    return this.shiftService.create(createShiftDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update fuel-holder by id',
  })
  @ApiResponse({ type: Shift })
  async update(
    @Param('id') id: number,
    @Body() updateShiftDto: UpdateShiftDto,
  ): Promise<Shift> {
    return this.shiftService.update(
      {
        where: {
          id,
        },
      },
      updateShiftDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete fuel holder by id',
  })
  @ApiResponse({ type: Shift })
  async delete(@Param('id') id: number): Promise<Shift> {
    return this.shiftService.delete({ where: { id } });
  }
}
