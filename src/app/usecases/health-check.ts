import type { HealthCheckRepository } from '../../domain/repositories/health-check-repository';

type HealthCheckParams = {};

interface HealthCheckDeps {
  healthCheckRepository: HealthCheckRepository;
}

export async function healthCheck(
  _: HealthCheckParams,
  { healthCheckRepository }: HealthCheckDeps,
) {
  const healthStatus = await healthCheckRepository.check();
  return healthStatus;
}
