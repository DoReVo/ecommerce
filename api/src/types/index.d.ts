import { FastifyInstance } from "fastify";

import { Env } from "../config/Env";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    env: Env;
  }
}
