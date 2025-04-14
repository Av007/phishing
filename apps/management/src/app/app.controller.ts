import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PhishingService, SearchQueryDto } from '@libs/phishing';

@Controller()
export class AppController {
  constructor(private readonly phishingService: PhishingService) {}

  @UseGuards(JwtGuard)
  @Get('phishing')
  async findAll(@Query() query: SearchQueryDto) {
    const { limit, skip, ...filters } = query;
    return this.phishingService.findAll(filters, {limit, skip});
  }
}
