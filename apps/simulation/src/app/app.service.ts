import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Phishing, PhishingService, PhishingStatus } from '@libs/phishing';
import { MailerService } from './email.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly client: ClientKafka,
    private readonly emailService: MailerService,
    private readonly phishingService: PhishingService,
  ) {}

  async add(email: string): Promise<Phishing> {
    // TODO: add to track id email template id
    // Example: TemplateID:trackID
    return this.phishingService.create({
      trackId: randomUUID(),
      email,
      status: PhishingStatus.PENDING,
      createdAt: new Date(),
    });
  }

  async get(trackId: string) {
    return this.phishingService.findByTrackId(trackId);
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
}
