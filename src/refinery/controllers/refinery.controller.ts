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
import { RefineryService } from '../services/refinery.service';
import { Refinery } from '../entities/refinery.entity';
import { CreateRefineryDto } from '../dto/create-refinery.dto';
import { UpdateRefineryDto } from '../dto/update-refinery.dto';

@ApiTags('Refinery')
@Controller('refinery')
@UseInterceptors(ClassSerializerInterceptor)
export class RefineryController {
  constructor(private readonly refineryService: RefineryService) {}

  @Get()
  @ApiOperation({
    description: 'Get refinery list',
  })
  @ApiResponse({ type: Refinery, isArray: true })
  async findAll(): Promise<Refinery[]> {
    return this.refineryService.find({});
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get refinery by id',
  })
  @ApiResponse({ type: Refinery })
  async findOne(@Param('id') id: number): Promise<Refinery> {
    return this.refineryService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add refinery',
  })
  @ApiResponse({ type: Refinery })
  async create(
    @Body() createRefineryDto: CreateRefineryDto,
  ): Promise<Refinery> {
    return this.refineryService.create(createRefineryDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update refinery by id',
  })
  @ApiResponse({ type: Refinery })
  async update(
    @Param('id') id: number,
    @Body() updateRefineryDto: UpdateRefineryDto,
  ): Promise<Refinery> {
    return this.refineryService.update(
      {
        where: {
          id,
        },
      },
      updateRefineryDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete refinery by id',
  })
  @ApiResponse({ type: Refinery })
  async delete(@Param('id') id: number): Promise<Refinery> {
    return this.refineryService.delete({ where: { id } });
  }
}
