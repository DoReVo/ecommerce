import { FastifyPluginCallback } from "fastify";
import { nanoid } from "nanoid";
import { authMiddleware } from "../middleware/auth.js";

const cartRoutes: FastifyPluginCallback = async (app, _opts) => {
  const { prisma } = app;

  app.post("/", { preHandler: authMiddleware }, async (req, res) => {
    const { productId, amount } = req.body;

    const cartItem = await prisma.userCart.upsert({
      create: {
        productId,
        userId: req?.user?.id,
        amount,
      },
      where: {
        productId_userId: {
          productId,
          userId: req?.user?.id,
        },
      },
      update: {
        amount: amount,
      },
    });

    return { message: "ok" };
  });

  app.get("/", { preHandler: authMiddleware }, async (req, res) => {
    return await prisma.userCart.findMany({
      where: {
        userId: req?.user?.id,
      },
      include: {
        product: true,
      },
    });
  });

  app.delete("/", async (req, res) => {});
};

export default cartRoutes;
