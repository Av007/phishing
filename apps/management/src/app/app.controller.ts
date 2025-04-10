import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/logs/:startDate/:endDate')
  async logs(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string
  ) {
    // return this.appService.filterLogs(startDate, endDate);
  }
}
