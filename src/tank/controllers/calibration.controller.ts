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
  async findAll(@Query('filter.tank') tankId: number): Promise<Calibration[]> {
    return this.calibrationService.find({
      where: {
        tank: {
          id: tankId,
        },
      },
      relations: {
        tank: true,
      },
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
  @ApiResponse({ type: () => Calibration, isArray: true })
  @ApiBody({ type: CreateCalibrationDto, isArray: true })
  async create(
    @Body() createCalibrationDto: CreateCalibrationDto[],
  ): Promise<Calibration[]> {
    return Promise.all(
      createCalibrationDto.map((item) => this.calibrationService.create(item)),
    );
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
  async deleteByTankId(
    @Query('filter.tank') id: number,
  ): Promise<Calibration[]> {
    return this.calibrationService.deleteMany({ where: { tank: { id } } });
  }
}
