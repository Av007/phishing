import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PhishingService, SearchQueryDto } from '@libs/phishing';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly phishingService: PhishingService,
    private readonly appService: AppService
  ) {}

  @UseGuards(JwtGuard)
  @Get('phishing')
  async findAll(@Query() query: SearchQueryDto) {
    const { limit, skip, ...filters } = query;
    return this.phishingService.findAll(filters, {limit, skip});
  }

  @UseGuards(JwtGuard)
  @Post('bulk/send')
  bulkSend(@Body() data: {ids: string[]}) {
    const { ids } = data;
    this.appService.sendBulk(ids);
    return {success: true};
  }
}
