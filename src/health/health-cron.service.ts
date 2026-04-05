import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class HealthCronService {
  private readonly logger = new Logger(HealthCronService.name);

  constructor(private readonly configService: ConfigService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async pingHealthRoute(): Promise<void> {
    const isEnabled = this.configService.get<boolean>('SELF_HEALTH_CRON_ENABLED') ?? false;

    if (!isEnabled) {
      return;
    }

    const appUrl = this.configService.get<string>('APP_URL');

    if (!appUrl) {
      this.logger.warn('SELF_HEALTH_CRON_ENABLED=true but APP_URL is missing. Skipping ping.');
      return;
    }

    const normalizedAppUrl = appUrl.replace(/\/$/, '');
    const targetUrl = `${normalizedAppUrl}/api/v1/health`;

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'user-agent': 'finance-backend-health-cron/1.0',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        this.logger.warn(`Health ping failed with status ${response.status} for ${targetUrl}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown ping error';
      this.logger.warn(`Health ping error for ${targetUrl}: ${message}`);
    }
  }
}
