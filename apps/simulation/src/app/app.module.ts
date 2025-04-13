import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LogModule } from '@libs/log';
import { DatabaseModule } from '@libs/database';
import { PhishingService } from '@libs/phishing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'EVENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CLIENT_ID'),
              brokers: [configService.get<string>('KAFKA_BROKER')],
              requestTimeout: 30000
            },
            consumer: {
              groupId: configService.get<string>('KAFKA_SIMULATOR_GROUP_ID'),
            },
          },
        }),
      },
    ]),
    DatabaseModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService, PhishingService],
})
export class AppModule {}
