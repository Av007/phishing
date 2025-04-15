import { LogService } from '@libs/log';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly client: ClientKafka,
    private readonly logService: LogService,
  ) {}

  async sendBulk(ids: string[]): Promise<void> {
    if (!ids) {
      return;
    }
    this.logService.log(`Prepare to send ${ids.length} phishing send request`);
    ids.map((id: string) => {
      if (id) {
        this.logService.log(`Sending phishing send request ${id}`);
        this.client.emit('request.phishing.sending', {id});
      }
    });
  }
}
