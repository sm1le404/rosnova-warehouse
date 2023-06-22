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
import { SupplyService } from '../services/supply.service';
import { Supply } from '../entities/supply.entity';
import { CreateSupplyDto, UpdateSupplyDto } from '../dto';

@ApiTags('Supply')
@Controller('supply')
@UseInterceptors(ClassSerializerInterceptor)
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Get()
  @ApiOperation({
    summary: 'Get supply list',
  })
  @ApiResponse({ type: Supply, isArray: true })
  async findAll(): Promise<Supply[]> {
    return this.supplyService.find({});
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get supply by id',
  })
  @ApiResponse({ type: Supply })
  async findOne(@Param('id') id: number): Promise<Supply> {
    return this.supplyService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add supply',
  })
  @ApiResponse({ type: Supply })
  async create(@Body() createSupplyDto: CreateSupplyDto): Promise<Supply> {
    return this.supplyService.create(createSupplyDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update supply by id',
  })
  @ApiResponse({ type: Supply })
  async update(
    @Param('id') id: number,
    @Body() updateSupplyDto: UpdateSupplyDto,
  ): Promise<Supply> {
    return this.supplyService.update(
      {
        where: {
          id,
        },
      },
      updateSupplyDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete supply by id',
  })
  @ApiResponse({ type: Supply })
  async delete(@Param('id') id: number): Promise<Supply> {
    return this.supplyService.delete({ where: { id } });
  }
}
