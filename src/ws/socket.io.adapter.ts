import { IoAdapter } from '@nestjs/platform-socket.io';
import * as io from 'socket.io';
import * as http from 'http';
import https from 'https';

export class SocketIoAdapter extends IoAdapter {
  protected ioServerHttp: io.Server;

  constructor(protected server: http.Server | https.Server) {
    super();

    const options = {
      cors: {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      },
    };

    this.ioServerHttp = new io.Server(server, options);
  }

  sendMessage(eventName: string, message: any) {
    this.ioServerHttp.emit(eventName, message);
  }

  async close() {
    await this.ioServerHttp.close();
  }
}
