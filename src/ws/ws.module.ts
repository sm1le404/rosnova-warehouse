import { Module } from '@nestjs/common';
import { WsStateGateway } from './ws-state.gateway';
import { WsSubscriber } from './ws.subscriber';
import { SocketObserver } from './socket.observer';

@Module({
  providers: [WsStateGateway, WsSubscriber, SocketObserver],
  exports: [WsStateGateway, SocketObserver],
})
export class WsModule {}
