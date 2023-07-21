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
  async findAll(): Promise<Calibration[]> {
    return this.calibrationService.find({});
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
    summary: 'Add calibration',
  })
  @ApiResponse({ type: () => Calibration })
  async create(
    @Body() createCalibrationDto: CreateCalibrationDto,
  ): Promise<Calibration> {
    return this.calibrationService.create(createCalibrationDto);
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
}
