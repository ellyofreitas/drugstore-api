import { asValue } from 'awilix';
import type { FastifyBaseLogger, FastifyPluginCallback } from 'fastify';
import postgres from 'postgres';

const environment = process.env.NODE_ENV ?? 'development';
export const sql = postgres(process.env.POSTGRES_URL!);

export class PostgresDriver {
  #sql: postgres.Sql;

  constructor(connectionUrl: string, pgLog: FastifyBaseLogger) {
    this.#sql = postgres(connectionUrl, {
      transform: { ...postgres.toCamel, undefined: null },
      ...(environment === 'development' && {
        debug: (conn, query) => pgLog.debug({ conn, query }, 'query'),
      }),
    });
  }

  get sql() {
    return this.#sql;
  }
}

declare module '@fastify/awilix' {
  interface Cradle {
    pgDriver: PostgresDriver;
  }
}

export type FastifyPostgresOptions = {
  connectionUrl: string;
};

const diRegister: FastifyPluginCallback<FastifyPostgresOptions> = (
  fastify,
  options,
  done,
) => {
  const pgLog = fastify.log.child({ plugin: 'postgres' });
  const pgDriver = new PostgresDriver(options.connectionUrl, pgLog);
  fastify.diContainer.register({ pgDriver: asValue(pgDriver) });
  fastify.addHook('onReady', async () => {
    pgLog.debug('connecting to postgres');
    await pgDriver.sql`select 1`;
  });
  fastify.gracefulShutdown((signal) => {
    pgLog.debug({ signal }, 'closing postgres connection');
    return pgDriver.sql.end();
  });
  done();
};

export default diRegister;
