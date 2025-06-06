import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { SocketIoAdapter } from './socket.io.adapter';

@Injectable()
export class SocketObserver implements OnApplicationShutdown {
  private sockets: SocketIoAdapter[] = [];

  addSocket(socket: SocketIoAdapter): void {
    this.sockets.push(socket);
  }

  sendMessage(eventName: string, message: any) {
    this.sockets.forEach((socket) => {
      socket.sendMessage(eventName, message);
    });
  }

  async onApplicationShutdown(): Promise<void> {
    this.sockets.forEach((socket) => {
      socket.close();
    });
  }
}
