import Fastify from "fastify";
import dotenv from "dotenv";
import pkg from "@prisma/client";
import userRoutes from "./src/routes/users.js";
import authorRoutes from "./src/routes/authorRoutes.js";
import path from "path";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import bookRoutes from "./src/routes/bookRoutes.js";
import dashboardRoutes from "./src/routes/dashboard.js";
import bookclubRoutes from "./src/routes/bookclub.js";

dotenv.config();

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const fastify = Fastify({ logger: true });

// Decorate Fastify with Prisma
fastify.decorate("prisma", prisma);

// Enable CORS for frontend
fastify.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

// Enable multipart uploads
fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Serve uploaded images
fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
});

// Register routes
fastify.register(userRoutes);
fastify.register(authorRoutes, { prefix: "/authors" });
fastify.register(bookRoutes, { prefix: "/books" });
fastify.register(dashboardRoutes, { prefix: "/dashboard" });
fastify.register(bookclubRoutes, { prefix: "/bookclub" });

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
    });
    fastify.log.info(
      `🚀 Server ready at http://localhost:${process.env.PORT || 3000}`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
