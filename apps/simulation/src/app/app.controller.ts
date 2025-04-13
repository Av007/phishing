import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { PhishingCreateDto } from '@libs/phishing';
import { LogService } from '@libs/log';
import { AppService } from './app.service';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('EVENT_SERVICE') private readonly client: ClientKafka,
    private readonly appService: AppService,
    private readonly logService: LogService,
  ) {}

  @Post('/phishing/send')
  phishingSend(@Body() data: PhishingCreateDto) {
    const { emails } = data;

    const emailsFiltered = emails
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
    this.logService.debug('adding phishing');

    this.appService.saveBatch(emailsFiltered);
    return 'ok';
  }

  @EventPattern('request.phishing.save')
  async sendEmail(@Payload() data: { email: string }) {
    this.logService.debug('adding phishing');
    const phishing = await this.appService.add(data.email);
    this.appService.sendEmail({
      email: phishing.email,
      trackId: phishing.trackId,
    });
  }

  onModuleInit() {
    this.client.subscribeToResponseOf('request.phishing.save');
  }
}
