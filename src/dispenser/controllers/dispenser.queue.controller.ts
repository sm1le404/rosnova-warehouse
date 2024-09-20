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
import { LogDirection, logDispensers } from '../../common/utility/rootpath';

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
  async checkState(@Body() payload: GetQueStateDto): Promise<any> {
    try {
      await logDispensers(`${JSON.stringify(payload)}`, LogDirection.IN);
    } catch (e) {
      console.log(
        `[${new Date().toUTCString()}] ${LogDirection.IN} ${JSON.stringify(
          payload,
        )}`,
      );
    }
    const result = await this.dispenserQueueService.checkState(payload);
    try {
      await logDispensers(`${JSON.stringify(result)}`, LogDirection.OUT);
    } catch (e) {
      console.log(
        `[${new Date().toUTCString()}] ${LogDirection.OUT} ${JSON.stringify(
          result,
        )}`,
      );
    }
    return result;
  }
}
