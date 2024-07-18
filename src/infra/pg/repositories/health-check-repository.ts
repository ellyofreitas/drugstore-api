import { asClass } from 'awilix';
import type { FastifyPluginCallback } from 'fastify';
import { HealthStatus } from '../../../domain/entities/health-status';
import type { HealthCheckRepository } from '../../../domain/repositories/health-check-repository';
import type { PostgresDriver } from '../driver';

export class PGHealthCheckRepository implements HealthCheckRepository {
  constructor(readonly pgDriver: PostgresDriver) {}

  private toDomain(rs: any): HealthStatus {
    return new HealthStatus(rs.healthy);
  }

  async check(): Promise<HealthStatus> {
    const { sql } = this.pgDriver;
    const [rs] = await sql`select true as healthy`;
    return this.toDomain(rs);
  }
}

declare module '@fastify/awilix' {
  interface Cradle {
    pgHealthCheckRepository: PGHealthCheckRepository;
  }
}

const diRegister: FastifyPluginCallback = (fastify, _, done) => {
  fastify.diContainer.register({
    pgHealthCheckRepository: asClass(PGHealthCheckRepository).singleton(),
  });
  done();
};

export default diRegister;
