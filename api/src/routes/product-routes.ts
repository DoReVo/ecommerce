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
};

export default productRoutes;
