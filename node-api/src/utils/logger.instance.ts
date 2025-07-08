import { env } from "@app/config/env.config";
import pino, { LoggerOptions } from "pino";

const isProduction = env.APP_ENV === "production";
const level = env.LOG_LEVEL || (isProduction ? "info" : "debug");

const options: LoggerOptions = {
  level,
  redact: ['req.headers.authorization', 'user.password'],
  serializers: {
    err: pino.stdSerializers.err,
    req: (req) => ({ id: req.id, method: req.method, url: req.url }),
  },
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        },
      }),
};

export const logger = pino(options);