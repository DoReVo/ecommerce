import { FastifyPluginCallback } from "fastify";
import { nanoid } from "nanoid";
import { authMiddleware } from "../middleware/auth.js";

const cartRoutes: FastifyPluginCallback = async (app, _opts) => {
  const { prisma } = app;

  app.addHook("preHandler", authMiddleware);

  app.post("/checkout", async (req, res) => {
    
  });

  app.post("/", async (req, res) => {
    let { productId, amount } = req.body;

    // Delete
    if (amount <= 0)
      return await prisma.userCart.delete({
        where: {
          productId_userId: {
            productId,
            userId: req?.user?.id,
          },
        },
      });

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

  app.get("/", async (req, res) => {
    return await prisma.userCart.findMany({
      where: {
        userId: req?.user?.id,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  app.delete("/", async (req, res) => {
    const { productId } = req.body;

    return await prisma.userCart.delete({
      where: {
        productId_userId: {
          productId,
          userId: req?.user?.id,
        },
      },
    });
  });
};

export default cartRoutes;
