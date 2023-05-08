import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { SocketController } from '../socket.controller';

@Module({
  providers: [Gateway],
  controllers: [SocketController],
})
export class GatewayModule {}
