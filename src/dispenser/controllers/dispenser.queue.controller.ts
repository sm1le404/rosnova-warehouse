import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Dispenser } from '../entities/dispenser.entity';
import { DispenserQueueService } from '../services/dispenser.queue.service';
import { GetQueStateDto } from '../dto';

@ApiTags('Dispenser que')
@Controller('dispenser/que')
@UseInterceptors(ClassSerializerInterceptor)
export class DispenserQueueController {
  constructor(private readonly dispenserQueueService: DispenserQueueService) {}

  @Post()
  @ApiOperation({
    summary: 'Set dispenser state',
  })
  @ApiResponse({ type: () => Dispenser, isArray: true })
  async find(@Body() payload: GetQueStateDto): Promise<any> {
    return this.dispenserQueueService.checkState(payload);
  }
}
