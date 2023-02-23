import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: configuration().cors.allowedOrigin });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
