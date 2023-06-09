import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { RefreshToken } from './entities/refresh-token.entity';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { AuthCacheService } from '../auth-cache.service';

@Global()
@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([RefreshToken])],
  controllers: [TokenController],
  providers: [TokenService, AuthCacheService],
  exports: [TokenService],
})
export class TokenModule {}
