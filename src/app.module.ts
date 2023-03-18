import { Module } from '@nestjs/common';
import { UserModule } from './endpoints/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './endpoints/auth/auth.module';
import configuration from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './endpoints/auth/guard/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './endpoints/users/entities/user.entity';
import { CollectionsModule } from './endpoints/collections/collections.module';
import PublicFile from './endpoints/files/entities/publicFile.entity';
import Collection from './endpoints/collections/entities/collection.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<object>('database.config'),
        entities: [User, PublicFile, Collection],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CollectionsModule,
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
