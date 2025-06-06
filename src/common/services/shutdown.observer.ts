import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class ShutdownObserver implements OnApplicationShutdown {
  private httpServers: (http.Server | https.Server)[] = [];

  addHttpServer(server: http.Server | https.Server): void {
    this.httpServers.push(server);
  }

  async onApplicationShutdown(): Promise<void> {
    await Promise.all(
      this.httpServers.map(
        (server) =>
          new Promise((resolve, reject) => {
            server.close((error) => {
              if (error) {
                reject(error);
              } else {
                resolve(null);
              }
            });
          }),
      ),
    );
  }
}
