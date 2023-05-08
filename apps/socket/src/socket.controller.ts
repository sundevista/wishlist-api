import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import WishLogDto from './models/wish-log.dto';
import { Gateway } from './gateway/gateway';

@Controller()
export class SocketController {
  constructor(@Inject(Gateway) private gateway: Gateway) {}
  @EventPattern('log_wish')
  async logInfo(@Payload() payload: WishLogDto) {
    return this.gateway.logInfo(payload);
  }
}
