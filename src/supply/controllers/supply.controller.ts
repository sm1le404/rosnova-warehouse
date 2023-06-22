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
import { CreateSupplyDto, ResponseSupplyDto, UpdateSupplyDto } from '../dto';
import { CommonPagination } from '../../common/decorators';
import {
  PaginationSupply,
  PaginationSupplyParams,
} from '../classes/pagination-supply.params';
import { Paginate } from 'nestjs-paginate';

@ApiTags('Supply')
@Controller('supply')
@UseInterceptors(ClassSerializerInterceptor)
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Get()
  @ApiOperation({
    summary: 'Get supply list',
  })
  @CommonPagination(
    PaginationSupplyParams.filterableColumns,
    PaginationSupplyParams.searchableColumns,
    PaginationSupplyParams.sortableColumns,
  )
  @ApiResponse({ type: ResponseSupplyDto })
  async findAll(
    @Paginate() paginationPayload: PaginationSupply,
  ): Promise<ResponseSupplyDto> {
    return this.supplyService.findPagination(paginationPayload);
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
