import * as bodyParser from 'body-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import swaggerInit from './docs';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);

  app.use(bodyParser.urlencoded({ extended: true }));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;

  await swaggerInit(app);
  
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
