import { join } from 'node:path';
import fastifyAutoload from '@fastify/autoload';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const fastifyDIPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyAutoload, {
    dir: join(__dirname, '..', 'routes'),
  });
};

export default fp(fastifyDIPlugin, {
  name: 'routes',
  dependencies: ['di'],
});
