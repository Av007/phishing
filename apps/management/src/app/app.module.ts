import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@libs/database';
import { PhishingModule, PhishingService } from '@libs/phishing';
import { LogModule } from '@libs/log';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
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
              groupId: configService.get<string>('KAFKA_GROUP_ID'),
            },
          },
        }),
      },
    ]),
    LogModule,
    AuthModule,
    PhishingModule,
  ],
  controllers: [AppController],
  providers: [AppService, PhishingService],
})
export class AppModule {}
