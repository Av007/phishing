import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogModule } from '@libs/log';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
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
    LogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
