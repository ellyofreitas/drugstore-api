import type { FastifyPluginAsync } from 'fastify';
import fastifyGracefulShutdown from 'fastify-graceful-shutdown';
import fp from 'fastify-plugin';

const fastifyGracefulShutdownPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyGracefulShutdown);
};

export default fp(fastifyGracefulShutdownPlugin, {
  name: 'gracefulShutdown',
});
