import { Module } from '@nestjs/common';

import { UserModule } from './models/user/user.module';
import { AuthModule } from './auth/auth.module';
import { CollectionModule } from './models/collection/collection.module';
import { WishModule } from './models/wish/wish.module';
import { CoreModule } from './core/core.module';
import { TokenModule } from './auth/token/token.module';

@Module({
  imports: [
    CoreModule,
    UserModule,
    AuthModule,
    TokenModule,
    CollectionModule,
    WishModule,
  ],
})
export class AppModule {}
