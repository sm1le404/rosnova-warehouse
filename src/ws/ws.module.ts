import { Module } from '@nestjs/common';
import { WsStateGateway } from './ws-state.gateway';

@Module({
  providers: [WsStateGateway],
  exports: [WsStateGateway],
})
export class WsModule {}
