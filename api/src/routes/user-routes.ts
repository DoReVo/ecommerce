import { FastifyPluginCallback } from "fastify";
import { nanoid } from "nanoid";

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

    await prisma.apiTokens.create({
      data: {
        token,
        userId: user?.id,
      },
    });

    return res.send({ token, user });
  });

  app.get("/me", async (req, res) => {
    const token = req?.headers?.authorization;

    req.log.info("token %s", token);

    const tokenInDb = await prisma.apiTokens.findFirst({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!tokenInDb)
      return res
        .status(401)
        .send({ error: { message: "You are not authorized" } });

    return tokenInDb?.user;
  });
};

export default userRoutes;
