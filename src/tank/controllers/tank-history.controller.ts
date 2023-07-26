import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { HasRole } from '../../auth/guard/has-role.guard';
import { RoleType } from '../../user/enums';
import { TankHistoryService } from '../services/tank-history.service';
import { ResponseTankHistoryDto } from '../dto';
import { Paginate } from 'nestjs-paginate';
import {
  PaginationTankHistory,
  PaginationTankHistoryParams,
} from '../classes/pagination-tank-history.params';
import { CommonPagination } from '../../common/decorators';

@ApiTags('Tank-history')
@Controller('tank-history')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
export class TankHistoryController {
  constructor(private readonly tankHistoryService: TankHistoryService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get tank history list',
  })
  @CommonPagination(
    PaginationTankHistoryParams.filterableColumns,
    PaginationTankHistoryParams.searchableColumns,
    PaginationTankHistoryParams.sortableColumns,
  )
  @ApiResponse({ type: () => ResponseTankHistoryDto, isArray: true })
  async findPagination(
    @Paginate() paginationPayload: PaginationTankHistory,
  ): Promise<ResponseTankHistoryDto> {
    return this.tankHistoryService.findPagination(paginationPayload);
  }
}
