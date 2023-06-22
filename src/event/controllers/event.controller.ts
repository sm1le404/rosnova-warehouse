import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventService } from '../services/event.service';
import { Event } from '../entities/event.entity';

@ApiTags('Event')
@Controller('event')
@UseInterceptors(ClassSerializerInterceptor)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  //@TODO pagination with filter
  @Get()
  @ApiOperation({
    summary: 'Get events list',
  })
  @ApiResponse({ type: Event, isArray: true })
  async findAll(): Promise<Event[]> {
    return this.eventService.find({});
  }
}
