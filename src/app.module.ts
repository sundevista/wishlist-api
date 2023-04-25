import { Module } from '@nestjs/common';
import { UserModule } from './endpoints/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './endpoints/auth/auth.module';
import configuration from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './endpoints/auth/guard/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsModule } from './endpoints/collections/collections.module';
import { WishesModule } from './endpoints/wishes/wishes.module';
import { RolesGuard } from './endpoints/auth/guard/role.guard';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<object>('database.config'),
        entities: [],
        autoLoadEntities: true,
        migrations: [],
        migrationsTableName: 'migrations',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CollectionsModule,
    WishesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
