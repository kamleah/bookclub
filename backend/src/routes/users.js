export default async function userRoutes(fastify) {
  const prisma = fastify.prisma;

  // Create a new user
  fastify.post("/users", async (req, reply) => {
    const { name, email } = req.body;
    const user = await prisma.user.create({ data: { name, email } });
    reply.code(201).send(user);
  });

  // Get all users
  fastify.get("/users", async (_, reply) => {
    const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
    reply.send(users);
  });

  // Get a single user
  fastify.get("/users/:id", async (req, reply) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return reply.code(404).send({ message: "User not found" });
    reply.send(user);
  });

  // Update user
  fastify.put("/users/:id", async (req, reply) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { name, email },
      });
      reply.send(user);
    } catch {
      reply.code(404).send({ message: "User not found" });
    }
  });

  // Delete user
  fastify.delete("/users/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      await prisma.user.delete({ where: { id: Number(id) } });
      reply.send({ message: "User deleted" });
    } catch {
      reply.code(404).send({ message: "User not found" });
    }
  });
}
