import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { FilesModule } from '../file/files.module';
import { AuthCacheService } from '../../auth/auth-cache.service';
import { TokenModule } from '../../auth/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FilesModule, TokenModule],
  controllers: [UserController],
  providers: [UserService, AuthCacheService],
  exports: [UserService],
})
export class UserModule {}
