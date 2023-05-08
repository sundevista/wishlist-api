import { NestFactory } from '@nestjs/core';
import { SocketModule } from './socket.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(SocketModule);
  const configService = app.get(ConfigService);

  const host = configService.get('RABBITMQ_HOST');
  const queueName = configService.get('RABBITMQ_QUEUE_NAME');

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${host}`],
      queue: queueName,
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(9002);
}

bootstrap();
