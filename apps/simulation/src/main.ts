import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'local',
        brokers: ['kafka:9093'],
      },
      consumer: {
        groupId: 'test-id'
      },
    }
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(4000);
  Logger.log(
    `🚀 Application is running on: localhost:4000`
  );
}

bootstrap();
