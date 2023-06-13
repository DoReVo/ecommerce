import { FastifyPluginCallback } from "fastify";
import { nanoid } from "nanoid";
import { authMiddleware } from "../middleware/auth.js";

const userRoutes: FastifyPluginCallback = async (app, _opts) => {
  const { prisma } = app;

  /* Create a user */
  app.post("/register", async (req, _res) => {
    return await prisma.user.create({ data: req.body as any });
  });

  /* Login a user */

  app.post("/login", async (req, res) => {
    const { email, password } = req.body as any;
    // Find user
    const user = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user)
      return res
        .status(404)
        .send({ error: { message: "Credentials not found" } });

    const token = nanoid();

    // save token

    await prisma.apiToken.create({
      data: {
        token,
        userId: user?.id,
      },
    });

    return res.send({ token, user });
  });

  app.get("/me", { preHandler: authMiddleware }, async (req, res) => {
    const user = req?.user;

    return user;
  });
};

export default userRoutes;
