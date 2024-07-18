import type { FastifyPluginCallback } from 'fastify';

const healthCheckRouter: FastifyPluginCallback = (server, _, next) => {
  server.get('/health-check', async (request, _reply) => {
    const controller = request.diScope.resolve('healthCheckController');
    const carriers = await controller.check(request);
    return carriers;
  });
  next();
};

export default healthCheckRouter;
