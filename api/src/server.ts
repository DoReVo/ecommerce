import fastify, { FastifyLoggerOptions } from "fastify";
import fastifyEnv from "@fastify/env";
import { EnvSchema } from "./config/Env.js";
import apiRoutes from "./api-routes.js";
import { DateTime } from "luxon";
import fastifyCors from "@fastify/cors";
import { nanoid } from "nanoid";
import prismaPlugin from "./plugins/prisma.js";
import fastifyCookie from "@fastify/cookie";
import type { FastifyCookieOptions } from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";
import fs from "fs/promises";

interface EnvOptions {
  development: {
    transport: {
      target: "string";
      options: {
        translateTime: string;
        ignore: string;
      };
    };
  };
  production: boolean;
  test: boolean;
}

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const environment: keyof EnvOptions =
  (process.env.NODE_ENV as keyof EnvOptions) ??
  ("production" as keyof EnvOptions);

const app = fastify({
  logger: (envToLogger?.[environment] as FastifyLoggerOptions) ?? true,
  disableRequestLogging: true,
  genReqId: () => nanoid(),
});

/* Environment variable plugin */
await app.register(fastifyEnv, {
  schema: EnvSchema,
  dotenv: true,
  confKey: "env",
});

/* CORS plugin */
await app.register(fastifyCors, {
  origin: "*",
});

await app.register(prismaPlugin);

await app.register(fastifyCookie, {} as FastifyCookieOptions);

// Create upload directory
await fs.mkdir("artifacts/temporary", { recursive: true });
await fs.mkdir("artifacts/images", { recursive: true });

await app.register(fastifyMultipart, {
  limits: {
    fileSize: 50000000,
  },
});

/* Register the routes for our app */
await app.register(apiRoutes, { prefix: "api" });

/* Graceful shutdown stuff */
/* ---------------------------------------------------------- */
const signals = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGTERM: 15,
};

// Create a listener for each of the signals that we want to handle
Object.keys(signals).forEach((signal) => {
  process.on(signal, async () => {
    app.log.info("Shutdown process started, signal given: %s", signal);

    app.log.info("HTTP Server is shutting down");
    await app.close();
    app.log.info("HTTP Server is closed");

    app.log.info("Shutdown process finished, signal given: %s", signal);

    process.exit(0);
  });
});

/* ---------------------------------------------------------- */

app.get("/", async () => {
  return { message: `Ecommerce API ${DateTime.now().toISO()}` };
});

try {
  await app.listen({ port: app.env.PORT, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
