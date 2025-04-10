import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LogService } from '@libs/log';
import { DatabaseService } from '@libs/database';

@Injectable()
export class AppService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly client: ClientKafka,
    private readonly databaseService: DatabaseService,
    private readonly logService: LogService
  ) {}
}
