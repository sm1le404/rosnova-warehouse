import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrailerService } from '../services/trailer.service';
import { Trailer } from '../entities/trailer.entity';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../../user/enums';
import { JwtAuthGuard } from '../../auth/guard';
import { HasRole } from '../../auth/guard/has-role.guard';
import { CreateTrailerDto, UpdateTrailerDto } from '../dto';

@ApiTags('Trailer')
@Controller('trailer')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class TrailerController {
  constructor(private readonly trailerService: TrailerService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get trailer list',
  })
  @ApiResponse({ type: () => Trailer, isArray: true })
  async findAll(): Promise<Trailer[]> {
    return this.trailerService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get trailer by id',
  })
  @ApiResponse({ type: () => Trailer })
  async findOne(@Param('id') id: number): Promise<Trailer> {
    return this.trailerService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Add trailer',
  })
  @ApiResponse({ type: () => Trailer })
  async create(@Body() createTrailerDto: CreateTrailerDto): Promise<Trailer> {
    return this.trailerService.create(createTrailerDto);
  }

  @Put(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Update trailer by id',
  })
  @ApiResponse({ type: () => Trailer })
  async update(
    @Param('id') id: number,
    @Body() updateTrailerDto: UpdateTrailerDto,
  ): Promise<Trailer> {
    return this.trailerService.update(
      {
        where: {
          id,
        },
      },
      updateTrailerDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete trailer by id',
  })
  @ApiResponse({ type: () => Trailer })
  async delete(@Param('id') id: number): Promise<Trailer> {
    return this.trailerService.delete({ where: { id } });
  }

  @Post('kafka')
  async sendToKafkaByDate(
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
  ) {
    await this.trailerService.uploadByDateToKafka(dateFrom, dateTo);
  }

  @Post('kafka/:limit')
  async sendToKafka(@Param('limit') limit: number) {
    await this.trailerService.uploadAllToKafka(limit);
  }
}
