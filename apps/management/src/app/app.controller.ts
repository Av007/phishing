import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Phishing, PhishingCreateDto, PhishingService, SearchQueryDto } from '@libs/phishing';
import { LogService } from '@libs/log';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly phishingService: PhishingService,
    private readonly appService: AppService,
    private readonly logService: LogService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('phishing')
  async findAll(@Query() query: SearchQueryDto) {
    const { limit, skip, ...filters } = query;
    return this.phishingService.findAll(filters, { limit, skip });
  }

  @UseGuards(JwtGuard)
  @Post('bulk/send')
  bulkSend(@Body() data: { ids: string[] }) {
    const { ids } = data;
    this.appService.sendBulk(ids);
    return { success: true };
  }

  @Post('phishing/send')
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

  @Get('track/:id')
  async phishingClick(@Param('id') trackId: string): Promise<string> {
    const phishing = await this.appService.getByTrackId(trackId);
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
  async save(@Payload() data: { email: string }) {
    this.logService.debug('adding phishing');
    await this.appService.add(data.email);
  }

  @EventPattern('request.phishing.sending')
  async send(@Payload() data: { id: string }) {
    const phishing = await this.appService.get(data.id);
    if (!phishing) {
      return;
    }
    this.logService.log(`Sending email for ${phishing._id}`);

    try {
      await this.appService.sendEmail({
        email: phishing.email,
        trackId: phishing.trackId,
      });
      phishing.status = PhishingStatus.SENDING;
    } catch (e) {
      this.logService.error(`Error sending message ${e.message}`);
      phishing.status = PhishingStatus.FAILED;
    }

    await this.appService.update(phishing);
  }
}
