import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefineryService } from '../services/refinery.service';
import { Refinery } from '../entities/refinery.entity';
import { CreateRefineryDto } from '../dto/create-refinery.dto';
import { UpdateRefineryDto } from '../dto/update-refinery.dto';
import { JwtAuthGuard } from '../../auth/guard';
import { RoleType } from '../../user/enums';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { HasRole } from '../../auth/guard/has-role.guard';

@ApiTags('Refinery')
@Controller('refinery')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class RefineryController {
  constructor(private readonly refineryService: RefineryService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get refinery list',
  })
  @ApiResponse({ type: () => Refinery, isArray: true })
  async findAll(): Promise<Refinery[]> {
    return this.refineryService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get refinery by id',
  })
  @ApiResponse({ type: () => Refinery })
  async findOne(@Param('id') id: number): Promise<Refinery> {
    return this.refineryService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Add refinery',
  })
  @ApiResponse({ type: () => Refinery })
  async create(
    @Body() createRefineryDto: CreateRefineryDto,
  ): Promise<Refinery> {
    return this.refineryService.create(createRefineryDto);
  }

  @Put(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Update refinery by id',
  })
  @ApiResponse({ type: () => Refinery })
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
  @ApiResponse({ type: () => Refinery })
  async delete(@Param('id') id: number): Promise<Refinery> {
    return this.refineryService.delete({ where: { id } });
  }

  @Post('kafka')
  async sendToKafka() {
    await this.refineryService.uploadAllToKafka();
  }
}
