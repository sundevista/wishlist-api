import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { PostgresModule } from './postgres/postgres.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PostgresModule,
  ],
  exports: [],
})
export class CoreModule {}
