import { join } from 'node:path';
import fastifyAutoload from '@fastify/autoload';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const fastifyDIPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyAwilixPlugin, { injectionMode: 'CLASSIC' });
  await fastify.register(fastifyAutoload, {
    dir: join(__dirname, '..', '..', 'pg'),
    options: {
      connectionUrl: fastify.config.POSTGRES_URL,
    },
  });
  await fastify.register(fastifyAutoload, {
    dir: join(__dirname, '..', '..', '..', 'interface', 'controllers'),
  });
};

export default fp(fastifyDIPlugin, {
  name: 'di',
  dependencies: ['environment', 'gracefulShutdown'],
});
