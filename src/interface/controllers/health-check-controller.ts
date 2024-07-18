import { asClass } from 'awilix';
import type { FastifyPluginCallback } from 'fastify';
import { healthCheck } from '../../app/usecases/health-check';
import type { PGHealthCheckRepository } from '../../infra/pg/repositories/health-check-repository';
import type { ControllerRequest } from '../http/controller-request';

export class HealthCheckController {
  constructor(
    private readonly pgHealthCheckRepository: PGHealthCheckRepository,
  ) {}

  async check(_: ControllerRequest) {
    const healthStatus = await healthCheck(
      {},
      { healthCheckRepository: this.pgHealthCheckRepository },
    );
    return healthStatus;
  }
}

declare module '@fastify/awilix' {
  interface Cradle {
    healthCheckController: HealthCheckController;
  }
}

const diRegister: FastifyPluginCallback = (fastify, _, done) => {
  fastify.diContainer.register({
    healthCheckController: asClass(HealthCheckController).singleton(),
  });
  done();
};

export default diRegister;
