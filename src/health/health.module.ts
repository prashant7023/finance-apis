import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthCronService } from './health-cron.service';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, HealthCronService],
})
export class HealthModule {}
