import { FastifyPluginCallback } from "fastify";
import { authMiddleware } from "../middleware/auth.js";

const summaryRoutes: FastifyPluginCallback = async (app, _opts) => {
  const { prisma } = app;

  app.addHook("preHandler", authMiddleware);

  app.get("/", async (req, res) => {
    const data = await prisma.userCheckout.findMany({
      include: { user: true },
    });

    const total = await prisma.userCheckout.aggregate({
      _sum: {
        amount: true,
      },
    });

    return { total, checkoutData: data };
  });
};

export default summaryRoutes;
