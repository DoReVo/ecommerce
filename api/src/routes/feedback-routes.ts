// @ts-nocheck
import { FastifyPluginCallback } from "fastify";
import { nanoid } from "nanoid";

const feedbackRoutes: FastifyPluginCallback = async (app, _opts) => {
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
};

export default feedbackRoutes;
