import { WebSocketGateway } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { CommonStateWebSocketGateway } from '../common/gateways/common-state-web-socket.gateway';
import { WSAllExceptionFilter } from '../common/filters/ws-all-exception.filter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(WSAllExceptionFilter)
export class WsStateGateway extends CommonStateWebSocketGateway {
  onModuleInit(): any {
    this.roomName = 'app';
  }
}
