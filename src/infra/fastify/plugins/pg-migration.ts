import { fileURLToPath } from 'node:url';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import shift from 'postgres-shift';

const fastifyPostgresPlugin: FastifyPluginAsync = async (fastify) => {
  const pgLog = fastify.log.child({ plugin: 'pgMigration' });
  const pgDriver = fastify.diContainer.resolve('pgDriver');
  fastify.addHook('onReady', async () => {
    pgLog.debug('connecting to postgres');
    await shift({
      sql: pgDriver.sql,
      path: fileURLToPath(new URL('../../pg/migrations', import.meta.url)),
      before({ migration_id: id, name: migrationName }) {
        pgLog.info({ id, migrationName }, 'applying migration');
      },
      after({ migration_id: id, name: migrationName }) {
        pgLog.info({ id, migrationName }, 'applied migration');
      },
    })
      .then(() => pgLog.info('all migrations applied'))
      .catch((err) => {
        pgLog.error('error applying migrations');
        throw err;
      });
  });
};

export default fp(fastifyPostgresPlugin, {
  name: 'pgMigration',
  dependencies: ['di', 'environment'],
});
