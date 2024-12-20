import { Module } from '@nestjs/common';
import { WsStateGateway } from './ws-state.gateway';
import { WsSubscriber } from './ws.subscriber';

@Module({
  providers: [WsStateGateway, WsSubscriber],
  exports: [WsStateGateway],
})
export class WsModule {}
