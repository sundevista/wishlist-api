import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import Wish from './entities/wish.entity';
import { UserModule } from '../user/user.module';
import { CollectionModule } from '../collection/collection.module';
import { FileModule } from '../file/file.module';
import { AuthCacheService } from '../../auth/auth-cache.service';
import { TokenModule } from '../../auth/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    UserModule,
    CollectionModule,
    FileModule,
    TokenModule,
  ],
  controllers: [WishController],
  providers: [WishService, AuthCacheService],
})
export class WishModule {}
