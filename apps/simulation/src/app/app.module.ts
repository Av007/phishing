import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LogModule } from '@libs/log';
import { DatabaseModule } from '@libs/database';
import { PhishingModule, PhishingService } from '@libs/phishing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
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
    PhishingModule
  ],
  controllers: [AppController],
  providers: [AppService, MailerService, PhishingService],
})
export class AppModule {}
