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
import { OutcomeService } from '../services/outcome.service';
import { Outcome } from '../entities/outcome.entity';
import { CreateOutcomeDto, UpdateOutcomeDto } from '../dto';

@ApiTags('Outcome')
@Controller('outcome')
@UseInterceptors(ClassSerializerInterceptor)
export class OutcomeController {
  constructor(private readonly outcomeService: OutcomeService) {}

  @Get()
  @ApiOperation({
    description: 'Get outcome list',
  })
  @ApiResponse({ type: Outcome, isArray: true })
  async findAll(): Promise<Outcome[]> {
    return this.outcomeService.find({});
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get outcome by id',
  })
  @ApiResponse({ type: Outcome })
  async findOne(@Param('id') id: number): Promise<Outcome> {
    return this.outcomeService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add outcome',
  })
  @ApiResponse({ type: Outcome })
  async create(@Body() createOutcomeDto: CreateOutcomeDto): Promise<Outcome> {
    return this.outcomeService.create(createOutcomeDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update outcome by id',
  })
  @ApiResponse({ type: Outcome })
  async update(
    @Param('id') id: number,
    @Body() updateOutcomeDto: UpdateOutcomeDto,
  ): Promise<Outcome> {
    return this.outcomeService.update(
      {
        where: {
          id,
        },
      },
      updateOutcomeDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete outcome by id',
  })
  @ApiResponse({ type: Outcome })
  async delete(@Param('id') id: number): Promise<Outcome> {
    return this.outcomeService.delete({ where: { id } });
  }
}
