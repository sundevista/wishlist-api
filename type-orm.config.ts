import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './services/rest-api/endpoints/users/entities/user.entity';
import PublicFile from './services/rest-api/endpoints/files/entities/publicFile.entity';
import Wish from './services/rest-api/endpoints/wishes/entities/wish.entity';
import Collection from './services/rest-api/endpoints/collections/entities/collection.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [User, PublicFile, Wish, Collection],
  migrations: [],
  migrationsRun: true,
  migrationsTableName: 'migrations',
});
