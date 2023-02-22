import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: configuration().cors.allowedOrigin });
  await app.listen(3000);
}

bootstrap();
