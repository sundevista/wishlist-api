import { Module } from '@nestjs/common';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { CollectionsModule } from './models/collection/collections.module';
import { WishesModule } from './models/wish/wishes.module';
import { CoreModule } from './core/core.module';
import { TokenModule } from './auth/token/token.module';

@Module({
  imports: [
    CoreModule,
    UserModule,
    AuthModule,
    TokenModule,
    CollectionsModule,
    WishesModule,
  ],
})
export class AppModule {}
