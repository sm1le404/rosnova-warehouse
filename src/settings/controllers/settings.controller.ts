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
import { CreateSettingDto } from '../dto/create-setting.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';
import { JwtAuthGuard } from '../../auth/guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../../user/enums';
import { HasRole } from '../../auth/guard/has-role.guard';
import { SettingsService } from '../services/settings.service';
import { Settings } from '../entities/settings.entity';

@ApiTags('Settings')
@Controller('settings')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get settings list',
  })
  @ApiResponse({ type: () => Settings, isArray: true })
  async findAll(): Promise<Settings[]> {
    return this.settingsService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get setting by id',
  })
  @ApiResponse({ type: () => Settings })
  async findOne(@Param('id') id: number): Promise<Settings> {
    return this.settingsService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add setting',
  })
  @ApiResponse({ type: () => Settings })
  async create(@Body() createSettingDto: CreateSettingDto): Promise<Settings> {
    return this.settingsService.create(createSettingDto);
  }

  @Put(':id')
  @SetRoles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Update setting by id',
  })
  @ApiResponse({ type: () => Settings })
  async update(
    @Param('id') id: number,
    @Body() updateSettingDto: UpdateSettingDto,
  ): Promise<Settings> {
    return this.settingsService.update(
      {
        where: {
          id,
        },
      },
      updateSettingDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete setting by id',
  })
  @ApiResponse({ type: () => Settings })
  async delete(@Param('id') id: number): Promise<Settings> {
    return this.settingsService.delete({ where: { id } });
  }
}
