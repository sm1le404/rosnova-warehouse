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
import { DockService } from '../services/dock.service';
import { CreateDockDto } from '../dto/create-dock.dto';
import { UpdateDockDto } from '../dto/update-dock.dto';
import { JwtAuthGuard } from '../../auth/guard';
import { RoleType } from '../../user/enums';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { HasRole } from '../../auth/guard/has-role.guard';
import { Dock } from '../entities/dock.entity';

@ApiTags('Dock')
@Controller('dock')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class DockController {
  constructor(private readonly dockService: DockService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get carrier list',
  })
  @ApiResponse({ type: () => Dock, isArray: true })
  async findAll(): Promise<Dock[]> {
    return this.dockService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get carrier by id',
  })
  @ApiResponse({ type: () => Dock })
  async findOne(@Param('id') id: number): Promise<Dock> {
    return this.dockService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Add carrier',
  })
  @ApiResponse({ type: () => Dock })
  async create(@Body() createDockDto: CreateDockDto): Promise<Dock> {
    return this.dockService.create(createDockDto);
  }

  @Put(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Update carrier by id',
  })
  @ApiResponse({ type: () => Dock })
  async update(
    @Param('id') id: number,
    @Body() updateDockDto: UpdateDockDto,
  ): Promise<Dock> {
    return this.dockService.update(
      {
        where: {
          id,
        },
      },
      updateDockDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete carrier by id',
  })
  @ApiResponse({ type: () => Dock })
  async delete(@Param('id') id: number): Promise<Dock> {
    return this.dockService.delete({ where: { id } });
  }

  @Get('kafka')
  async sendToKafkaByDate(
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
  ) {
    await this.dockService.uploadByDateToKafka(dateFrom, dateTo);
  }

  @Get('kafka/:limit')
  async sendToKafka(@Param('limit') limit: number) {
    await this.dockService.uploadAllToKafka(limit);
  }
}
