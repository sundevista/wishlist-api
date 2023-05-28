import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('postgres.host'),
      port: +this.configService.get('postgres.port'),
      username: this.configService.get('postgres.username'),
      password: this.configService.get('postgres.password'),
      database: this.configService.get('postgres.database'),
      synchronize: false,
      logging: false,
      migrationsRun: false,
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
    };
  }
}
