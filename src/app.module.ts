import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import configuration from "./config/configuration";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./auth/guard/jwt-auth.guard";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forRoot({load: [configuration]})],
      useFactory: (configService: ConfigService) => ({uri: configService.get<string>('database.connectionString')}),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },],
})
export class AppModule {}
