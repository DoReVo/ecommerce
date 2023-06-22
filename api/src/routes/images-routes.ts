import { FastifyPluginCallback } from "fastify";
import fs from "fs";
const imagesRoutes: FastifyPluginCallback = async (app, _opts) => {
  const { prisma } = app;

  app.get("/product-image/:id/*", async (req, res) => {
    const { id } = req.params;

    const imageData = await prisma.productImages.findFirst({ where: { id } });

    if (!imageData)
      return res.status(404).send({ error: { message: "NO IMAGE" } });

    return res
      .type(imageData?.mimeType)
      .send(fs.createReadStream(imageData?.filePath));
  });
};

export default imagesRoutes;
