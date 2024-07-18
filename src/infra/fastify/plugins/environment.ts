import fastifyEnv from '@fastify/env';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      POSTGRES_URL: string;
    };
  }
}

const fastifyEnvironmentPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyEnv, {
    confKey: 'config',
    schema: {
      type: 'object',
      properties: {
        POSTGRES_URL: { type: 'string' },
        PORT: { type: 'number', default: 3000 },
      },
      required: ['POSTGRES_URL', 'PORT'],
    },
  });
};

export default fp(fastifyEnvironmentPlugin, {
  name: 'environment',
});
