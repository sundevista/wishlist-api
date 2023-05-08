import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [ConfigModule.forRoot(), GatewayModule],
  providers: [ConfigService],
})
export class SocketModule {}
