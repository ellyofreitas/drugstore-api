import { dirname, join } from 'node:path';
import fastifyAutoload from '@fastify/autoload';
import fastify from 'fastify';
import pino from 'pino';

const env = process.env.NODE_ENV ?? 'development';
const isDevelopment = env === 'development';
const isTest = env === 'test';

const __filename = new URL(import.meta.url).pathname;
const __dirname = dirname(__filename);

const port = Number.parseInt(process.env.PORT ?? '4000', 10);

export class FastifyServer {
  static app = fastify({
    logger: this.setupLogger(),
  });

  static {
    this.setupErrorHandler();
    this.setupPlugins();
    if (!isTest) this.start();
  }

  private static setupLogger() {
    if (isDevelopment) {
      const transport = pino.transport({
        targets: [
          ...(isDevelopment
            ? [
                {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                  },
                },
              ]
            : []),
        ],
      });
      return pino({}, transport);
    }
    return true;
  }

  private static setupErrorHandler() {
    this.app.setErrorHandler(async (error, _, reply) => {
      this.app.log.error(error);
      // if (error instanceof ValidationError) {
      //   return reply.code(400).send({ message: error.message });
      // }
      if (isDevelopment) throw error;
      return reply.code(500).send({ message: 'Internal server error' });
    });
  }

  private static setupPlugins() {
    this.app.register(fastifyAutoload, {
      dir: join(__dirname, 'plugins'),
    });
  }

  private static start() {
    this.app.listen({ port }, (err) => {
      if (err) {
        this.app.log.error(err);
        process.exit(1);
      }
    });
  }
}
