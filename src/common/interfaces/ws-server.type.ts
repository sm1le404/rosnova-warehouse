import { Server } from 'socket.io';

export type WsServer = Server & {
  adapter: {
    rooms: Set<string>;
  };
};
