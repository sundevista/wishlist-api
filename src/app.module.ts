import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configuration from "./config/configuration";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forRoot({load: [configuration]})],
      useFactory: (configService: ConfigService) => ({uri: configService.get<string>('database.connectionString')}),
      inject: [ConfigService],
    }),
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
