import pino from 'pino';

const pinoLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid.hostname',
    },
  },
});

export function getLogger(context: string) {
  return pinoLogger.child({ context });
}
