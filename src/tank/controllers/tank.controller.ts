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
import { TankService } from '../services/tank.service';
import { Tank } from '../entities/tank.entity';
import { CreateTankDto, UpdateTankDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { HasRole } from '../../auth/guard/has-role.guard';
import { RoleType } from '../../user/enums';

@ApiTags('Tank')
@Controller('tank')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class TankController {
  constructor(private readonly tankService: TankService) {}

  @Post('stat')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Send info to stat',
  })
  async sentToStat(): Promise<void> {
    await this.tankService.sendToStatistic();
  }

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get tank list',
  })
  @ApiResponse({ type: () => Tank, isArray: true })
  async findAll(): Promise<Tank[]> {
    return this.tankService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get tank by id',
  })
  @ApiResponse({ type: () => Tank })
  async findOne(@Param('id') id: number): Promise<Tank> {
    return this.tankService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add tank',
  })
  @ApiResponse({ type: () => Tank })
  async create(@Body() createTankDto: CreateTankDto): Promise<Tank> {
    return this.tankService.create(createTankDto);
  }

  @Put(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Update tank by id',
  })
  @ApiResponse({ type: () => Tank })
  async update(
    @Param('id') id: number,
    @Body() updateTankDto: UpdateTankDto,
  ): Promise<Tank> {
    return this.tankService.update(
      {
        where: {
          id,
        },
      },
      updateTankDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete tank by id',
  })
  @ApiResponse({ type: () => Tank })
  async delete(@Param('id') id: number): Promise<Tank> {
    return this.tankService.delete({ where: { id } });
  }
}
