import { FastifyPluginCallback } from "fastify";
import { nanoid } from "nanoid";
import { authMiddleware } from "../middleware/auth.js";

const productRoutes: FastifyPluginCallback = async (app, _opts) => {
  const { prisma } = app;

  app.post("/", async (req, res) => {
    const { name, description, price, stock } = req.body;

    return await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
      },
    });
  });

  app.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    return await prisma.product.update({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
      },
      where: {
        id,
      },
    });
  });

  app.delete("/:id", async (req, res) => {
    const { id } = req.params;

    return await prisma.product.delete({ where: { id: id } });
  });

  app.get("/", async (req, res) => {
    return await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  });

  app.get("/:id", async (req, res) => {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!product)
      return res.status(404).send({ error: { message: "Product not found" } });

    return product;
  });

  // Feedback stuff

  // Create feedback
  app.post(
    "/:productId/feedbacks",
    { preHandler: authMiddleware },
    async (req, res) => {
      const { productId } = req.params;

      return await prisma.productFeedback.create({
        data: {
          text: req?.body?.text,
          productId,
          userId: req.user?.id,
        },
      });
    }
  );

  app.get("/:productId/feedbacks", async (req, res) => {
    const { productId } = req.params;

    return await prisma.productFeedback.findMany({
      where: {
        productId,
      },
      include: {
        product: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });
};

export default productRoutes;
