// @ts-nocheck
import { FastifyPluginCallback } from "fastify";
import { authMiddleware } from "../middleware/auth.js";

const summaryRoutes: FastifyPluginCallback = async (app, _opts) => {
  const { prisma } = app;

  app.addHook("preHandler", authMiddleware);

  app.get("/", async (req, res) => {
    const data = await prisma.userCheckout.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.userCheckout.aggregate({
      _sum: {
        amount: true,
      },
    });

    return { total: total._sum.amount, checkoutData: data };
  });

  /* Get sales history */
  app.get("/purchase-history", async (req, res) => {
    const data = await prisma.userCheckout.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  });
};

export default summaryRoutes;
