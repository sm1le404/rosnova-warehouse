import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventService } from '../services/event.service';
import { CommonPagination } from '../../common/decorators';
import {
  PaginationEvent,
  PaginationEventParams,
} from '../classes/pagination-event.params';
import { ResponseEventDto } from '../dto/response-event.dto';
import { Paginate } from 'nestjs-paginate';
import { JwtAuthGuard } from '../../auth/guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../../user/enums';
import { HasRole } from '../../auth/guard/has-role.guard';

@ApiTags('Event')
@Controller('event')
@UseInterceptors(ClassSerializerInterceptor)
//@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @ApiOperation({
    summary: 'Get events list',
  })
  @CommonPagination(
    PaginationEventParams.filterableColumns,
    PaginationEventParams.searchableColumns,
    PaginationEventParams.sortableColumns,
  )
  @ApiResponse({ type: () => ResponseEventDto })
  async findAll(
    @Paginate() paginationEventPayload: PaginationEvent,
  ): Promise<ResponseEventDto> {
    return this.eventService.findPagination(paginationEventPayload);
  }
}
