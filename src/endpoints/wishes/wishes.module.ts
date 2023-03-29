import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Wish from './entities/wish.entity';
import { UserModule } from '../users/users.module';
import { CollectionsModule } from '../collections/collections.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    UserModule,
    CollectionsModule,
    FilesModule,
  ],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
