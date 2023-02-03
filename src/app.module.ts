import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { WishModule } from './wish/wish.module';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [CompanyModule, UserModule, WishModule, IntegrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
