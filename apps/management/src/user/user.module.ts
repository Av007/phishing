import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { LogModule, LogService } from '@libs/log';
import { DatabaseModule, DatabaseService } from '@libs/database';
import { UserController } from './user.controller';
import { UserService } from './user.service';

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
  controllers: [UserController],
  providers: [UserService, DatabaseService, LogService],
})
export class UserModule {}
