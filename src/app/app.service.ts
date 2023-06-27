import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.logger.debug('Called when the current minute is 10');
  }
}
