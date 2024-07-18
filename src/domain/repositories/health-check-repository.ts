import type { HealthStatus } from '../entities/health-status';

export interface HealthCheckRepository {
  check(): Promise<HealthStatus>;
}
