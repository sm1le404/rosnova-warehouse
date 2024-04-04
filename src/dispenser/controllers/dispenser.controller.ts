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
import { DispenserService } from '../services/dispenser.service';
import { Dispenser } from '../entities/dispenser.entity';
import { CreateDispenserDto } from '../dto';
import { UpdateDispenserDto } from '../dto';
import { HasRole } from '../../auth/guard/has-role.guard';
import { JwtAuthGuard } from '../../auth/guard';
import { RoleType } from '../../user/enums';
import { SetRoles } from '../../auth/decorators/roles.decorator';

@ApiTags('Dispenser')
@Controller('dispenser')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class DispenserController {
  constructor(private readonly dispenserService: DispenserService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get dispenser list',
  })
  @ApiResponse({ type: () => Dispenser, isArray: true })
  async findAll(): Promise<Dispenser[]> {
    return this.dispenserService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get dispenser by id',
  })
  @ApiResponse({ type: () => Dispenser })
  async findOne(@Param('id') id: number): Promise<Dispenser> {
    return this.dispenserService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add dispenser',
  })
  @ApiResponse({ type: () => Dispenser })
  async create(
    @Body() createDispenserDto: CreateDispenserDto,
  ): Promise<Dispenser> {
    return this.dispenserService.create(createDispenserDto);
  }

  @Put(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Update dispenser by id',
  })
  @ApiResponse({ type: () => Dispenser })
  async update(
    @Param('id') id: number,
    @Body() updateDispenserDto: UpdateDispenserDto,
  ): Promise<Dispenser> {
    return this.dispenserService.update(
      {
        where: {
          id,
        },
      },
      updateDispenserDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete dispenser by id',
  })
  @ApiResponse({ type: () => Dispenser })
  async delete(@Param('id') id: number): Promise<Dispenser> {
    return this.dispenserService.delete({ where: { id } });
  }
}
