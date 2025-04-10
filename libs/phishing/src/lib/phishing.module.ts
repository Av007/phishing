import { Module } from '@nestjs/common';
import { DatabaseModule } from '@libs/database';
import { PhishingService } from './phishing.service';

@Module({
  imports: [DatabaseModule],
  providers: [PhishingService],
  exports: [PhishingService],
})
export class PhishingModule {}
