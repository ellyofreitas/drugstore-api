import fastifyCors from '@fastify/cors';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const fastifyCorsPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyCors, {
    allowedHeaders: '*',
    origin: '*',
    methods: '*',
  });
};

export default fp(fastifyCorsPlugin, {
  name: 'cors',
});
