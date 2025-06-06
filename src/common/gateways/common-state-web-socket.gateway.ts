import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Inject, LoggerService, OnModuleInit } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { WsServer } from '../interfaces/ws-server.type';
import { BaseEntity } from 'typeorm';
import { IGNORE_ENTITY_TYPES } from '../../ws/ws.const';
import { SocketObserver } from '../../ws/socket.observer';

export class CommonStateWebSocketGateway
  implements OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  private readonly server: WsServer;

  protected roomName;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    protected readonly socketObserver: SocketObserver,
  ) {}

  onModuleInit(): any {
    this.roomName = 'common';
  }

  /**
   * Обрабатывает соединение с клиентом.
   * Добавляет соединение в комнату
   */
  @SubscribeMessage('state')
  checkOrderStatus(@ConnectedSocket() client: Socket): void {
    this.logger.log(`Client connected room: ${this.roomName}`);
    client.join(this.roomName);
  }

  /**
   * Обрабатывает отключение клиента.
   * Удаляет соединение из всех комнат.
   * @param client Объект Socket, представляющий соединение с клиентом.
   */
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const rooms = Array.from(client.rooms);
    rooms.forEach((roomName) => client.leave(roomName));
    this.logger.log(`Client disconnect room: ${rooms}`);
  }

  /**
   * Кидает сообщение обновленной сущности
   * @param entityType
   * @param event
   * @param data
   */
  emitUpdateStatusToRoom(entityType: string, event: string, data: BaseEntity) {
    if (!IGNORE_ENTITY_TYPES.includes(entityType)) {
      this.socketObserver.sendMessage('state', { entityType, event, data });
      this.server.to(this.roomName).emit('state', { entityType, event, data });
    }
  }
}
