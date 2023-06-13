import { FastifyPluginCallback } from "fastify";
import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library.js";
import userRoutes from "./routes/user-routes.js";
import productRoutes from "./routes/product-routes.js";

const apiRoutes: FastifyPluginCallback = async (app, _opts) => {
  await app.register(userRoutes, { prefix: "users" });
  await app.register(productRoutes, { prefix: "products" });

  app.decorateRequest("user", null);

  app.setErrorHandler((error, _req, res) => {
    const isPrismaError =
      error instanceof PrismaClientRustPanicError ||
      error instanceof PrismaClientValidationError ||
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientInitializationError ||
      error instanceof PrismaClientUnknownRequestError;

    if (isPrismaError)
      return res
        .code(400)
        .send({ error: { message: `Prisma Error: ${error?.message}` } });
    else throw error;
  });
};

export default apiRoutes;
