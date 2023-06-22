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
    description: 'Get shift list',
  })
  @ApiResponse({ type: Shift, isArray: true })
  async findAll(): Promise<Shift[]> {
    return this.shiftService.find({});
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get shift by id',
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
    summary: 'Add shift',
  })
  @ApiResponse({ type: Shift })
  async create(@Body() createShiftDto: CreateShiftDto): Promise<Shift> {
    return this.shiftService.create(createShiftDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update shift by id',
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
    summary: 'Delete shift by id',
  })
  @ApiResponse({ type: Shift })
  async delete(@Param('id') id: number): Promise<Shift> {
    return this.shiftService.delete({ where: { id } });
  }
}
