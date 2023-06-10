import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import PublicFile from './entities/publicFile.entity';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile]), ConfigModule.forRoot()],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
