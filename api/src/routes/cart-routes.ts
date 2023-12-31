// @ts-nocheck
import { FastifyPluginCallback } from "fastify";
import { authMiddleware } from "../middleware/auth.js";

const cartRoutes: FastifyPluginCallback = async (app, _opts) => {
  const { prisma } = app;

  app.addHook("preHandler", authMiddleware);

  app.post("/checkout", async (req, res) => {
    // array of product Id to checkout
    const { products, address } = req.body;

    const cartData = await prisma.userCart.findMany({
      where: {
        userId: req?.user?.id,
      },
      include: {
        product: true,
      },
    });

    const total = cartData?.reduce(
      (prev, curr) => prev + curr?.amount * curr?.product?.price,
      0
    );

    // Create checkout
    await prisma.userCheckout.create({
      data: {
        userId: req?.user?.id,
        amount: total,
        data: cartData,
        address,
      },
    });

    // Clear cart
    await prisma.userCart.deleteMany({
      where: {
        userId: req?.user?.id,
      },
    });

    return { message: "ok" };
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

  app.get("/summary", async (req, res) => {});

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
