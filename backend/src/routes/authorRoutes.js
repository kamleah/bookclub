import fs from "fs";
import path from "path";

export default async function authorRoutes(fastify) {
  const prisma = fastify.prisma;

  fastify.get("/", async (req, reply) => {
    try {
      // Extract query params: ?page=1&limit=10
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 1;
      const skip = (page - 1) * limit;

      // Fetch total authors count
      const totalAuthors = await prisma.author.count();

      // Fetch authors with pagination
      const authors = await prisma.author.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
      });

      // Build pagination metadata
      const totalPages = Math.ceil(totalAuthors / limit);

      return {
        page,
        limit,
        totalAuthors,
        totalPages,
        data: authors,
      };
    } catch (err) {
      reply.code(500).send({ message: err.message });
    }
  });

  // 1️⃣ GET all authors
  fastify.get("/list", async (req, reply) => {
    try {
      const authors = await prisma.author.findMany({ orderBy: { id: "asc" } });
      return authors;
    } catch (err) {
      reply.code(500).send({ message: err.message });
    }
  });

  // 2️⃣ GET single author by ID
  fastify.get("/:id", async (req, reply) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id))
      return reply.code(400).send({ message: "Invalid author ID" });

    try {
      const author = await prisma.author.findUnique({ where: { id } });
      if (!author) return reply.code(404).send({ message: "Author not found" });
      return author;
    } catch (err) {
      reply.code(500).send({ message: err.message });
    }
  });

  // 3️⃣ POST new author (with optional image)
  fastify.post("/", async (req, reply) => {
    try {
      let name = "";
      let bio = "";
      let imagePath = null;

      // Iterate over multipart fields
      for await (const part of req.parts()) {
        if (part.file) {
          // Handle uploaded file
          const uploadDir = path.join(process.cwd(), "uploads");
          if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });

          const filename = `${Date.now()}-${part.filename}`;
          const filepath = path.join(uploadDir, filename);

          const writeStream = fs.createWriteStream(filepath);
          await part.file.pipe(writeStream);

          imagePath = `/uploads/${filename}`;
        } else {
          // Handle text fields
          if (part.fieldname === "name") name = part.value;
          if (part.fieldname === "bio") bio = part.value;
        }
      }

      const author = await prisma.author.create({
        data: {
          name,
          bio,
          image: imagePath,
        },
      });

      reply.code(201).send(author);
    } catch (err) {
      reply.code(500).send({ message: err.message });
    }
  });

  // 4️⃣ PUT update author
  fastify.put("/:id", async (req, reply) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id))
      return reply.code(400).send({ message: "Invalid author ID" });

    try {
      let name = "";
      let bio = "";
      let imagePath = null;

      // Handle multipart fields (text + optional file)
      for await (const part of req.parts()) {
        if (part.file) {
          const uploadDir = path.join(process.cwd(), "uploads");
          if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });

          const filename = `${Date.now()}-${part.filename}`;
          const filepath = path.join(uploadDir, filename);

          const writeStream = fs.createWriteStream(filepath);
          await part.file.pipe(writeStream);

          imagePath = `/uploads/${filename}`;
        } else {
          if (part.fieldname === "name") name = part.value;
          if (part.fieldname === "bio") bio = part.value;
        }
      }

      // Update author in Prisma
      const author = await prisma.author.update({
        where: { id },
        data: {
          name,
          bio,
          ...(imagePath && { image: imagePath }), // only update image if uploaded
        },
      });

      return author;
    } catch (err) {
      reply
        .code(404)
        .send({ message: "Author not found or error: " + err.message });
    }
  });

  // 5️⃣ DELETE author
  fastify.delete("/:id", async (req, reply) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id))
      return reply.code(400).send({ message: "Invalid author ID" });

    try {
      await prisma.author.delete({ where: { id } });
      return { message: "Author deleted" };
    } catch (err) {
      reply.code(404).send({ message: "Author not found" });
    }
  });
}
