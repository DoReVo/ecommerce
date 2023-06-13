import { preHandlerHookHandler } from "fastify";

const authMiddleware: preHandlerHookHandler = async (req, res) => {
  const token = req?.headers?.authorization;

  // Check user in db
  const tokenInDb = await req.server.prisma.apiToken.findFirst({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  if (!tokenInDb)
    return res
      .status(401)
      .send({ error: { message: "You are not authorized" } });

  const user = tokenInDb.user;

  req.user = user;
};

export { authMiddleware };
