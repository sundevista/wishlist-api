import { Module } from '@nestjs/common';
import { UserModule } from './endpoints/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './endpoints/auth/auth.module';
import configuration from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './endpoints/auth/guard/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './endpoints/user/entities/user.entity';
import { join } from 'path';
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<object>('database.config'),
        entities: [User],
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', configuration().static.source),
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
