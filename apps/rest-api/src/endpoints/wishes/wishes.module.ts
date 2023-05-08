import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Wish from './entities/wish.entity';
import { UserModule } from '../users/users.module';
import { CollectionsModule } from '../collections/collections.module';
import { FilesModule } from '../files/files.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    ConfigModule.forRoot(),
    UserModule,
    CollectionsModule,
    FilesModule,
  ],
  controllers: [WishesController],
  providers: [
    WishesService,
    {
      provide: 'LOGGER_SERVICE',
      useFactory: async (configService) => {
        const host = configService.get('RABBITMQ_HOST');
        const queueName = configService.get('RABBITMQ_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${host}`],
            queue: queueName,
            queueOptions: { durable: true },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class WishesModule {}
