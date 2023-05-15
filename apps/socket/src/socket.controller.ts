import { Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import WishLogDto from './models/wish-log.dto';
import { Gateway } from './gateway/gateway';

@Controller()
export class SocketController {
  constructor(@Inject(Gateway) private gateway: Gateway) {}
  @MessagePattern({ cmd: 'log_wish' })
  async logInfo(@Payload() payload: WishLogDto) {
    return this.gateway.logInfo(payload);
  }
}
