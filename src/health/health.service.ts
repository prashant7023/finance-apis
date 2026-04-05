import { Injectable } from '@nestjs/common';

export type HealthStatus = {
  status: 'ok';
  timestamp: string;
  uptimeSeconds: number;
};

@Injectable()
export class HealthService {
  getStatus(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
