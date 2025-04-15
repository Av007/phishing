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
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
  Logger.log(`🚀 Application is running on: http://localhost:4000`);
}

bootstrap();
