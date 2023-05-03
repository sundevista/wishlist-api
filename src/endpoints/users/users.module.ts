import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FilesModule } from '../files/files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    FilesModule,
    HttpModule,
    ConfigModule,
  ],
  controllers: [UserController, ProfileController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
