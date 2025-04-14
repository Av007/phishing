import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { Phishing, PhishingCreateDto, PhishingStatus } from '@libs/phishing';
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

  @Get('/track/:id')
  async phishingClick(@Param('id') trackId: string): Promise<string> {
    const phishing = await this.appService.get(trackId);
    if (!phishing) {
      this.logService.warn(`broke the trackId: ${trackId}`);
      phishing.status = PhishingStatus.FAILED;
      await this.appService.update(phishing);
      return 'not found';
    }

    phishing.status = PhishingStatus.CLICKED;
    await this.appService.update(phishing);

    this.logService.debug(`Phishing clicked: ${trackId}`);
    return 'ok';
  }

  @EventPattern('request.phishing.save')
  async sendEmail(@Payload() data: { email: string }) {
    this.logService.debug('adding phishing');
    await this.appService.add(data.email);
  }

  @EventPattern('request.phishing.sending')
  async send(@Payload() data: { trackId: string }) {
    const phishing: Phishing | null = await this.appService.get(data.trackId);
    if (!phishing) {
      return;
    }

    try {
      await this.appService.sendEmail({
        email: phishing.email,
        trackId: data.trackId,
      });
      phishing.status = PhishingStatus.SENDING;
    } catch (e) {
      this.logService.error(`Error sending message ${e.message}`);
      phishing.status = PhishingStatus.FAILED;
    }

    await this.appService.update(phishing);
  }

  onModuleInit() {
    this.client.subscribeToResponseOf('request.phishing.save');
  }
}
