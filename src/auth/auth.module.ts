import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserModule } from '../models/user/user.module';
import { AuthController } from './auth.controller';
import { TokenModule } from './token/token.module';
import { AuthCacheService } from './auth-cache.service';

@Module({
  imports: [UserModule, TokenModule],
  providers: [AuthService, AuthCacheService],
  controllers: [AuthController],
})
export class AuthModule {}
