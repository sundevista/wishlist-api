import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { FileModule } from '../file/file.module';
import { AuthCacheService } from '../../auth/auth-cache.service';
import { TokenModule } from '../../auth/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FileModule, TokenModule],
  controllers: [UserController],
  providers: [UserService, AuthCacheService],
  exports: [UserService],
})
export class UserModule {}
