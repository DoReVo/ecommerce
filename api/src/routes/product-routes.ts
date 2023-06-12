import { FastifyPluginCallback } from "fastify";
import { nanoid } from "nanoid";

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

export default productRoutes;
