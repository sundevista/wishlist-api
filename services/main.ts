import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './rest-api/app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { config as awsConfig } from 'aws-sdk';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const restApp = await NestFactory.create(AppModule);
  restApp.setGlobalPrefix('api');
  const configService = restApp.get(ConfigService);

  restApp.enableCors({ origin: configService.get('CORS_ALLOWED_ORIGIN') });
  restApp.useGlobalPipes(new ValidationPipe());
  restApp.useGlobalInterceptors(
    new ClassSerializerInterceptor(restApp.get(Reflector)),
  );

  const config = new DocumentBuilder()
    .setTitle('Wishlist API')
    .setDescription('The basic API that handles the requests of wishlist app.')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(restApp, config);
  SwaggerModule.setup('swagger', restApp, document);

  awsConfig.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  restApp.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: { port: 3001 },
    },
    { inheritAppConfig: true },
  );

  await restApp.startAllMicroservices();
  await restApp.listen(3000);
}

bootstrap();
