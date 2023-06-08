import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import Collection from './entities/collection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthCacheService } from '../../auth/auth-cache.service';
import { TokenModule } from '../../auth/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collection]), UserModule, TokenModule],
  controllers: [CollectionController],
  providers: [CollectionService, AuthCacheService],
  exports: [CollectionService],
})
export class CollectionModule {}
