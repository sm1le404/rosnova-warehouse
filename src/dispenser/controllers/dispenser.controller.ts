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
import { DispenserService } from '../services/dispenser.service';
import { Dispenser } from '../entities/dispenser.entity';
import { CreateDispenserDto } from '../dto/create-dispenser.dto';
import { UpdateDispenserDto } from '../dto/update-dispenser.dto';

@ApiTags('Dispenser')
@Controller('dispenser')
@UseInterceptors(ClassSerializerInterceptor)
export class DispenserController {
  constructor(private readonly dispenserService: DispenserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get dispenser list',
  })
  @ApiResponse({ type: Dispenser, isArray: true })
  async findAll(): Promise<Dispenser[]> {
    return this.dispenserService.find({});
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get dispenser by id',
  })
  @ApiResponse({ type: Dispenser })
  async findOne(@Param('id') id: number): Promise<Dispenser> {
    return this.dispenserService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add dispenser',
  })
  @ApiResponse({ type: Dispenser })
  async create(
    @Body() createDispenserDto: CreateDispenserDto,
  ): Promise<Dispenser> {
    return this.dispenserService.create(createDispenserDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update dispenser by id',
  })
  @ApiResponse({ type: Dispenser })
  async update(
    @Param('id') id: number,
    @Body() updateDispenserDto: UpdateDispenserDto,
  ): Promise<Dispenser> {
    return this.dispenserService.update(
      {
        where: {
          id,
        },
      },
      updateDispenserDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete dispenser by id',
  })
  @ApiResponse({ type: Dispenser })
  async delete(@Param('id') id: number): Promise<Dispenser> {
    return this.dispenserService.delete({ where: { id } });
  }
}
