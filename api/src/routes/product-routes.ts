// @ts-nocheck
import { FastifyPluginCallback } from "fastify";
import { nanoid } from "nanoid";
import { authMiddleware } from "../middleware/auth.js";
import util from "util";
import { pipeline } from "stream";
import fs from "fs";
import { isArray, isEmpty } from "lodash-es";

const pump = util.promisify(pipeline);

const productRoutes: FastifyPluginCallback = async (app, _opts) => {
  const { prisma } = app;

  /* Create product */
  app.post("/", async (req, res) => {
    const { name, description, price, stock, images } = req.body;

    const productData = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
      },
    });

    // Connect images
    if (!isEmpty(images) && isArray(images)) {
      let imagesEntry = await prisma.temporaryFiles.findMany({
        where: {
          id: { in: images },
        },
      });

      imagesEntry = imagesEntry?.map((entry) => ({
        ...entry,
        productId: productData?.id,
      }));

      await prisma.productImages.createMany({ data: imagesEntry });
    }
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

  /* Read all products */
  app.get("/", async (req, res) => {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { productImages: true },
    });
  });

  /* Read 1 product */
  app.get("/:id", async (req, res) => {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
      },
      orderBy: { createdAt: "desc" },
      include: {
        productImages: true,
      },
    });

    if (!product)
      return res.status(404).send({ error: { message: "Product not found" } });

    return product;
  });

  // Feedback stuff
  // ---------------------------------------------
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
  // ---------------------------------------------

  // Images stuff
  // ---------------------------------------------

  app.post("/images", { preHandler: authMiddleware }, async (req, res) => {
    const files = req.files();

    const fileData: any = [];

    for await (const file of files) {
      const id = nanoid();
      const path = `artifacts/temporary/${id}`;

      const record = await prisma.temporaryFiles.create({
        data: {
          id,
          fileName: file.filename,
          mimeType: file.mimetype,
          filePath: path,
        },
      });

      fileData.push(record);

      await pump(file.file, fs.createWriteStream(path));
    }

    return fileData;
  });
};

export default productRoutes;
