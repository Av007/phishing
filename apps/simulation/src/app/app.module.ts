import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LogModule } from '@libs/log';
import {DatabaseModule} from '@libs/database';
import { PhishingService } from '@libs/phishing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerService } from './email.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'local',
            brokers: ['kafka:9093'],
          },
          consumer: {
            groupId: 'test-id',
          },
        },
      },
    ]),
    DatabaseModule, 
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService, PhishingService],
})
export class AppModule {}
