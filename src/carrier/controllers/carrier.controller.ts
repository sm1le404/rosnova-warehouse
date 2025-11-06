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
import { CarrierService } from '../services/carrier.service';
import { CreateCarrierDto } from '../dto/create-carrier.dto';
import { UpdateCarrierDto } from '../dto/update-carrier.dto';
import { JwtAuthGuard } from '../../auth/guard';
import { RoleType } from '../../user/enums';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { HasRole } from '../../auth/guard/has-role.guard';
import { Carrier } from '../entities/carrier.entity';

@ApiTags('Carrier')
@Controller('carrier')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class CarrierController {
  constructor(private readonly carrierService: CarrierService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get carrier list',
  })
  @ApiResponse({ type: () => Carrier, isArray: true })
  async findAll(): Promise<Carrier[]> {
    return this.carrierService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get carrier by id',
  })
  @ApiResponse({ type: () => Carrier })
  async findOne(@Param('id') id: number): Promise<Carrier> {
    return this.carrierService.findOne({
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
  @ApiResponse({ type: () => Carrier })
  async create(@Body() createCarrierDto: CreateCarrierDto): Promise<Carrier> {
    return this.carrierService.create(createCarrierDto);
  }

  @Put(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Update carrier by id',
  })
  @ApiResponse({ type: () => Carrier })
  async update(
    @Param('id') id: number,
    @Body() updateCarrierDto: UpdateCarrierDto,
  ): Promise<Carrier> {
    return this.carrierService.update(
      {
        where: {
          id,
        },
      },
      updateCarrierDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete carrier by id',
  })
  @ApiResponse({ type: () => Carrier })
  async delete(@Param('id') id: number): Promise<Carrier> {
    return this.carrierService.delete({ where: { id } });
  }

  @Get('kafka')
  async sendToKafkaByDate(
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
  ) {
    await this.carrierService.uploadByDateToKafka(dateFrom, dateTo);
  }

  @Get('kafka/:limit')
  async sendToKafka(@Param('limit') limit: number) {
    await this.carrierService.uploadAllToKafka(limit);
  }
}
