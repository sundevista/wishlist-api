import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { diskStorage } from "multer";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('static.avatarDestination'),
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
            const ext = file.originalname.split('.').pop();
            const filename = uniqueSuffix + '.' + ext;
            callback(null, filename);
          }
        }),
      }),
    }),
  ],
  controllers: [UserController, ProfileController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
