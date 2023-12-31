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
import cartRoutes from "./routes/cart-routes.js";
import summaryRoutes from "./routes/summary-routes.js";
import imagesRoutes from "./routes/images-routes.js";

const apiRoutes: FastifyPluginCallback = async (app, _opts) => {
  await app.register(userRoutes, { prefix: "users" });
  await app.register(productRoutes, { prefix: "products" });
  await app.register(cartRoutes, { prefix: "cart" });
  await app.register(summaryRoutes, { prefix: "summary" });
  await app.register(imagesRoutes, { prefix: "images" });

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
