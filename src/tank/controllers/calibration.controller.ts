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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { HasRole } from '../../auth/guard/has-role.guard';
import { RoleType } from '../../user/enums';
import { CalibrationService } from '../services/calibration.service';
import { Calibration } from '../entities/calibration.entity';
import { CreateCalibrationDto, UpdateCalibrationDto } from '../dto';
import { GetCalibrationDto } from '../dto/get-calibration.dto';
import { FindOptionsWhere } from 'typeorm';

@ApiTags('Calibration')
@Controller('calibration')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class CalibrationController {
  constructor(private readonly calibrationService: CalibrationService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get calibration list',
  })
  @ApiResponse({ type: () => Calibration, isArray: true })
  async findAll(@Query() payload: GetCalibrationDto): Promise<Calibration[]> {
    const filter: FindOptionsWhere<Calibration> = {
      tank: {
        id: payload.tankId,
      },
    };
    if (payload.volume !== undefined) {
      filter.volume = payload.volume;
    }
    if (payload.level !== undefined) {
      filter.level = payload.level;
    }
    if (!payload.sortByVolume) {
      payload.sortByVolume = 'desc';
    }
    return this.calibrationService.find({
      where: filter,
      order: {
        level: payload.sortByVolume,
      },
      select: ['volume', 'level'],
    });
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get calibration by id',
  })
  @ApiResponse({ type: () => Calibration })
  async findOne(@Param('id') id: number): Promise<Calibration> {
    return this.calibrationService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add calibrations',
  })
  @ApiBody({ type: CreateCalibrationDto, isArray: true })
  async create(
    @Body() createCalibrationDto: CreateCalibrationDto[],
  ): Promise<void> {
    await this.calibrationService.createMany(createCalibrationDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update calibration by id',
  })
  @ApiResponse({ type: () => Calibration })
  async update(
    @Param('id') id: number,
    @Body() updateCalibrationDto: UpdateCalibrationDto,
  ): Promise<Calibration> {
    return this.calibrationService.update(
      {
        where: {
          id,
        },
      },
      updateCalibrationDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete calibration by id',
  })
  @ApiResponse({ type: () => Calibration })
  async delete(@Param('id') id: number): Promise<Calibration> {
    return this.calibrationService.delete({ where: { id } });
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete calibration by tank id',
  })
  @ApiResponse({ type: () => Calibration, isArray: true })
  async deleteByTankId(@Query('filter.tank') id: number): Promise<void> {
    await this.calibrationService.deleteHardMany({ tank: { id } });
  }
}
