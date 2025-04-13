import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get<string>('KAFKA_CLIENT_ID'),
        brokers: [configService.get<string>('KAFKA_BROKER')],
      },
      consumer: {
        groupId: configService.get<string>('KAFKA_SIMULATOR_GROUP_ID')
      },
    }
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  await app.listen(4000);
  Logger.log(
    `🚀 Application is running on: localhost:4000`
  );
}

bootstrap();
