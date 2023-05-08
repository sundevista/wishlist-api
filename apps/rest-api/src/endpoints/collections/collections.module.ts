import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import Collection from './entities/collection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collection]), UserModule],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
