import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Phishing, PhishingService, PhishingStatus } from '@libs/phishing';
import { LogService } from '@libs/log';
import { MailerService } from './email.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly client: ClientKafka,
    private readonly logService: LogService,
    private readonly emailService: MailerService,
    private readonly phishingService: PhishingService,
  ) {}

  async add(email: string): Promise<Phishing> {
    return this.phishingService.create({
      trackId: randomUUID(),
      email,
      status: PhishingStatus.PENDING,
      createdAt: new Date(),
    });
  }

  async getByTrackId(trackId: string) {
    return this.phishingService.findByTrackId(trackId);
  }

  async get(trackId: string) {
    return this.phishingService.find(trackId);
  }

  async update(phishing: Phishing) {
    return this.phishingService.update(phishing);
  }

  async sendEmail(message: Pick<Phishing, 'email' | 'trackId'>) {
    return this.emailService.sendMail(message.email, message.trackId);
  }

  saveBatch(emails: string[]) {
    emails.map((email: string) => {
      this.client.emit('request.phishing.save', { email });
    });
  }

  async sendBulk(ids: string[]): Promise<void> {
    if (!ids) {
      return;
    }
    this.logService.log(`Prepare to send ${ids.length} phishing send request`);
    ids.map((id: string) => {
      if (id) {
        this.logService.log(`Sending phishing send request ${id}`);
        this.client.emit('request.phishing.sending', { id });
      }
    });
  }
}
