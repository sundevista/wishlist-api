import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import WishLogDto from '../models/wish-log.dto';

@WebSocketGateway(9001, {
  cors: { origin: '*' },
})
export class Gateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connect', (socket) => {
      console.log(socket.id + ' connected');
    });
  }

  async logInfo(payload: WishLogDto) {
    const message = `CreationEvent: ${payload.createdBy} made a new wish [[${payload.name}]] linked to ${payload.link}`;
    this.server.emit('onMessage', { msg: 'New Message', content: message });
  }
}
