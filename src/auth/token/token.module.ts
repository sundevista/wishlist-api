import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenController } from './token.controller';
import { AuthCacheService } from '../auth-cache.service';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([RefreshToken])],
  controllers: [TokenController],
  providers: [TokenService, AuthCacheService],
  exports: [TokenService],
})
export class TokenModule {}
